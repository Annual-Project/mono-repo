import AggregatedProductService from '../services/AggregatedProductService.js';

import RolesStore from "../../../shared/stores/RolesStore.js";

class AggregatedProductController {

  // Méthode pour la page products (client)
  static async getAggregatedProductsByStore(req, res) {
    const { storeId } = req.params;
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

    const products = await AggregatedProductService.getAggregatedProductsByStore(storeId, limit, offset);
    // console.log(JSON.stringify(products, null, 2));
    res.status(200).render('client/products', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      ...products,
    });
  }

  // Méthode pour les produits de la page admin
  static async getAggregatedProductsForAdmin(req, res) {
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

    const products = await AggregatedProductService.getAggregatedProductsForAdmin(limit, offset);
    // console.log(JSON.stringify(products, null, 2));
    res.status(200).render('admin/products', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      ...products,
    });
  }

}

export default AggregatedProductController;
