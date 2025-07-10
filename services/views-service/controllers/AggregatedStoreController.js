import AggregatedStoreService from '../services/AggregatedStoreService.js';

class AggregatedStoreController {

  // Méthode pour la page stores (client)
  static async getAggregatedStores(req, res) {
    const { limit, offset } = req.query;
    const stores = await AggregatedStoreService.getAggregatedStores(limit, offset);
    res.status(200).render('client/stores', {
      stores,
    });
  }

  // Méthode pour la page stores (admin)

}

export default AggregatedStoreController;
