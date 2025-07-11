import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class AggregatedStoreService {

  // Méthode pour la page stores (client)
  static async getAggregatedStores(limit, offset) {

    const queryParams = new URLSearchParams();

    if (limit >= 0) {
      queryParams.append('limit', limit);
    }
    if (offset >= 0) {
      queryParams.append('offset', offset);
    }

    // Call en interne pour récupérer les magasins
    const stores = await fetch(`http://stocks_service:3000/api/v1/stores?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!stores.ok) {
      throw new BadRequestError('Failed to fetch stores');
    }

    const storesData = await stores.json();

    // Pour chaque magasin, récupérer la liste de ses stocks
    const storesWithStocks = await Promise.all(
      storesData.map(async (store) => {
        const stocksResponse = await fetch(`http://stocks_service:3000/api/v1/stocks/store/${store.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "x-internal-api-key": process.env.INTERNAL_API_KEY,
          },
        });

        if (!stocksResponse.ok) {
          throw new BadRequestError(`Failed to fetch stocks for store ${store.id}`);
        }

        const stocks = await stocksResponse.json();
        return { ...store, stocks };
      }
    ));

    // Pour chaque stock de chaque magasin, compter les produits et catégories associés
    const storesWithProducts = await Promise.all(
      storesWithStocks.map(async (store) => {
        const productIds = store.stocks.map(stock => stock.productId);

        const products = await Promise.all(
          productIds.map(async (productId) => {
            const productResponse = await fetch(`http://products_service:3000/api/v1/products/${productId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "x-internal-api-key": process.env.INTERNAL_API_KEY,
              },
            });

            if (!productResponse.ok) {
              throw new NotFoundError(`Product with ID ${productId} not found`);
            }

            const productData = await productResponse.json();
            return productData;
          })
        );

        // Supprimer les doublons
        const productsCount = products.length;
        const categoriesCount = new Set(
          products.map((product) => product.categoryId)
        ).size;

        return {
          ...store,
          productsCount,
          categoriesCount,
        };
      })
    );

    // console.log(JSON.stringify(storesWithProducts, null, 2));

    return storesWithProducts;

  }

  // Méthode pour la page stores (admin)
  static async getAggregatedStoresAdmin() {
    // 1. Récupération des magasins
    const storesResponse = await fetch('http://stocks_service:3000/api/v1/stores', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!storesResponse.ok) {
      throw new BadRequestError('Failed to fetch stores');
    }
    const stores = await storesResponse.json();

    // 2. Récupération des stocks et produits en parallèle
    const [stocksResponse, productsResponse] = await Promise.all([
      // Récupération de tous les stocks
      fetch('http://stocks_service:3000/api/v1/stocks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      }),
      
      // Récupération de tous les produits
      fetch('http://products_service:3000/api/v1/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      })
    ]);

    if (!stocksResponse.ok) {
      throw new BadRequestError('Failed to fetch stocks');
    }
    const allStocks = await stocksResponse.json();

    if (!productsResponse.ok) {
      throw new BadRequestError('Failed to fetch products');
    }
    const allProducts = await productsResponse.json();

    // 3. Création de maps pour accès rapide
    const productMap = new Map(allProducts.map(p => [p.id, p]));
    const stocksByStore = new Map();

    // 4. Regroupement des stocks par magasin et association des produits
    allStocks.forEach(stock => {
      // Création de l'entrée pour le store s'il n'existe pas
      if (!stocksByStore.has(stock.storeId)) {
        stocksByStore.set(stock.storeId, []);
      }
      
      // Association stock + produit
      const product = productMap.get(stock.productId);
      stocksByStore.get(stock.storeId).push({
        stockId: stock.id,
        quantityAvailable: stock.quantityAvailable,
        criticalThreshold: stock.criticalThreshold,
        product: product ? {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId
        } : null
      });
    });

    // 5. Construction de la réponse finale
    const aggregatedStores = stores.map(store => ({
      ...store,
      products: stocksByStore.get(store.id) || []
    }));

    // 6. Statistiques
    const storeCount = stores.length;
    const productCount = allProducts.length;
    const stockCount = allStocks.length;

    return {
      aggregatedStores,
      storeCount,
      productCount,
      stockCount
    };
  }

}

export default AggregatedStoreService;
