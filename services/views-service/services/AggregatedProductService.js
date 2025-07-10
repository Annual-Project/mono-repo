import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class AggregatedProductService {

  // Méthode pour la page products (client)
  static async getAggregatedProductsByStore(storeId, limit, offset) {
    const queryParams = new URLSearchParams();

    if (limit >= 0) {
      queryParams.append('limit', limit);
    }
    if (offset >= 0) {
      queryParams.append('offset', offset);
    }

    // Call en interne pour récupérer les informations du magasin
    const storeResponse = await fetch(`http://stocks_service:3000/api/v1/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!storeResponse.ok) {
      throw new NotFoundError(`Store with ID ${storeId} not found`);
    }

    const store = await storeResponse.json();

    // Call en interne pour récupérer les produits du magasin
    const stocksResponse = await fetch(`http://stocks_service:3000/api/v1/stocks/store/${storeId}`, {
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

    // Récupérer tous les produits associés
    // const productIds = stocks.map(stock => stock.productId);

    const products = await Promise.all(
      stocks.map(async (stock) => {
        const productId = stock.productId;

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
        return {
          ...stock,
          product: productData,
        };
      })
    );

    const productsCount = products.length;
    const categoriesCount = new Set(
      products.map(({ product }) => product?.categoryId),
    ).size;

    const uniqueCategories = Array.from(
      new Set(
        products.map(({ product }) => product?.category?.name),
      ),
    );

    return {
      storeName: store.name,
      products,
      productsCount,
      categoriesCount,
      uniqueCategories,
    };
  }

}

export default AggregatedProductService;
