import BadRequestError from "../exceptions/BadRequestError.js";

class AggregatedStockService {

  // Methode admin
  static async getAggregatedStocksForAdmin(limit, offset) {
    const queryParams = new URLSearchParams();

    if (limit >= 0) queryParams.append('limit', limit);
    if (offset >= 0) queryParams.append('offset', offset);

    // 1. Récupération des stocks
    const stocksResponse = await fetch(`http://stocks_service:3000/api/v1/stocks?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!stocksResponse.ok) {
      throw new BadRequestError('Failed to fetch stocks');
    }

    let stocks = await stocksResponse.json();

    // 2. Déduplication des stocks (productId + storeId)
    const uniqueStocksMap = new Map();
    stocks.forEach(stock => {
      const key = `${stock.productId}-${stock.storeId}`;
      if (!uniqueStocksMap.has(key)) {
        uniqueStocksMap.set(key, stock);
      }
    });
    stocks = Array.from(uniqueStocksMap.values());

    // 3. Récupération des IDs uniques
    const productIds = [...new Set(stocks.map(s => s.productId))];
    const storeIds = [...new Set(stocks.map(s => s.storeId))];

    // 4. Récupération des produits avec Promise.all
    const productsPromises = productIds.map(id => 
      fetch(`http://products_service:3000/api/v1/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      })
    );

    const allProductsResponse = await fetch(`http://products_service:3000/api/v1/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    })

    const allProducts = await allProductsResponse.json();

    const productsResponses = await Promise.all(productsPromises);
    const productsData = await Promise.all(
      productsResponses.map(res => {
        if (!res.ok) return null;
        return res.json();
      })
    );

    const productMap = new Map();
    productsData.forEach((product, index) => {
      if (product) {
        productMap.set(productIds[index], product);
      }
    });

    // 5. Récupération des magasins avec Promise.all
    const storesPromises = storeIds.map(id => 
      fetch(`http://stocks_service:3000/api/v1/stores/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      })
    );

    const storesResponses = await Promise.all(storesPromises);
    const storesData = await Promise.all(
      storesResponses.map(res => {
        if (!res.ok) return null;
        return res.json();
      })
    );

    const storeMap = new Map();
    storesData.forEach((store, index) => {
      if (store) {
        storeMap.set(storeIds[index], store);
      }
    });

    // 6. Fusion des données
    const aggregatedStocks = stocks.map(stock => ({
      ...stock,
      product: productMap.get(stock.productId) || null,
      store: storeMap.get(stock.storeId) || null
    }));

    // 7. Comptage des entités
    const productsCount = productIds.length;
    const storesCount = storeIds.length;

    return {
      aggregatedStocks,
      allProducts,
      productsCount,
      storesCount
    };
  }

}

export default AggregatedStockService;
