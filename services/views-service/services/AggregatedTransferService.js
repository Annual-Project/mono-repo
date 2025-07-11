import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class AggregatedTransferService {

  static async getAggregatedTransfersAdmin() {
    // 1. Récupération de tous les transferts
    const transfersResponse = await fetch('http://transfers_service:3000/api/v1/transfers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    if (!transfersResponse.ok) {
      throw new BadRequestError('Failed to fetch transfers');
    }
    const transfers = await transfersResponse.json();

    // 2. Extraction des IDs uniques
    const productIds = [...new Set(transfers.map(t => t.productId))];
    const storeIds = [
      ...new Set([
        ...transfers.map(t => t.sourceStoreId),
        ...transfers.map(t => t.destinationStoreId)
      ])
    ];

    // 3. Récupération parallèle des produits et magasins
    const [productsData, storesData] = await Promise.all([
      this.fetchProducts(productIds),
      this.fetchStores(storeIds)
    ]);

    // 4. Création de Maps pour accès rapide
    const productMap = new Map(productsData.map(p => [p.id, p]));
    const storeMap = new Map(storesData.map(s => [s.id, s]));

    // 5. Construction des transferts enrichis
    const aggregatedTransfers = transfers.map(transfer => ({
      id: transfer.id,
      productId: transfer.productId,
      sourceStoreId: transfer.sourceStoreId,
      destinationStoreId: transfer.destinationStoreId,
      quantity: transfer.quantity,
      status: transfer.status,
      comment: transfer.comment,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
      product: productMap.get(transfer.productId) || null,
      sourceStore: storeMap.get(transfer.sourceStoreId) || null,
      destinationStore: storeMap.get(transfer.destinationStoreId) || null
    }));

    // 6. Statistiques
    const transferCount = transfers.length;
    const productCount = productIds.length;
    const storeCount = storeIds.length;

    return {
      aggregatedTransfers,
      transferCount,
      productCount,
      storeCount
    };
  }

  static async fetchProducts(productIds) {
    // Récupération des produits avec Promise.all
    const promises = productIds.map(id => 
      fetch(`http://products_service:3000/api/v1/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      })
    );

    const responses = await Promise.all(promises);
    const results = await Promise.all(
      responses.map(res => res.ok ? res.json() : null)
    );

    return results.filter(Boolean);
  }

  static async fetchStores(storeIds) {
    // Récupération des magasins avec Promise.all
    const promises = storeIds.map(id => 
      fetch(`http://stocks_service:3000/api/v1/stores/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      })
    );

    const responses = await Promise.all(promises);
    const results = await Promise.all(
      responses.map(res => res.ok ? res.json() : null)
    );

    return results.filter(Boolean);
  }

}

export default AggregatedTransferService;
