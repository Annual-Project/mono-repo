import AggregatedStockService from '../services/AggregatedStockService.js';

import RolesStore from "../../../shared/stores/RolesStore.js";

class AggregatedStockController {

  // Méthode pour la page stocks (admin)
  static async getAggregatedStocksForAdmin(req, res) {
    const { limit, offset } = req.query;
    const user = req.auth;
    const { userId = null } = user || {};

    if (!userId) {
      return res.render('communes/404');
    }

    let hasAdmin = false;
    if (Number.parseInt(userId)) {
      try {
        const userRoles = await RolesStore.getRoles(userId);
        console.log("User Roles:", userRoles);
        hasAdmin = userRoles.includes('admin');
      } catch (error) {
        console.error("Error fetching user roles:", error);
        hasAdmin = false;
      }
    }

    const stocks = await AggregatedStockService.getAggregatedStocksForAdmin(limit, offset);
    console.log(JSON.stringify(stocks, null, 2));
    res.status(200).render('admin/stocks', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      ...stocks,
    });
  }

}

export default AggregatedStockController;
