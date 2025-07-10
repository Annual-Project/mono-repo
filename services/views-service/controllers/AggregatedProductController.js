import AggregatedProductService from '../services/AggregatedProductService.js';

class AggregatedProductController {

  // Méthode pour la page products (client)
  static async getAggregatedProductsByStore(req, res) {
    const { storeId } = req.params;
    const { limit, offset } = req.query;

    const products = await AggregatedProductService.getAggregatedProductsByStore(storeId, limit, offset);
    // console.log(JSON.stringify(products, null, 2));
    res.status(200).render('client/products', {
      ...products,
    });
  }

}

export default AggregatedProductController;
