import AggregatedStoreService from '../services/AggregatedStoreService.js';

import RolesStore from "../../../shared/stores/RolesStore.js";

class AggregatedStoreController {

  // Méthode pour la page stores (client)
  static async getAggregatedStores(req, res) {
    const { limit, offset } = req.query;
    const user = req.auth;
    const { userId = null } = user || {};

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

    const stores = await AggregatedStoreService.getAggregatedStores(limit, offset);
    res.status(200).render('client/stores', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      stores,
    });
  }

  // Méthode pour la page stores (admin)
  static async getAggregatedStoresAdmin(req, res) {
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

    const stores = await AggregatedStoreService.getAggregatedStores(limit, offset);
    // console.log(JSON.stringify(stores, null, 2));
    res.status(200).render('admin/stores', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      stores,
    });
  }

}

export default AggregatedStoreController;
