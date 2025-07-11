import AggregatedCategoriesService from '../services/AggregatedCategoryService.js';

import RolesStore from "../../../shared/stores/RolesStore.js";

class AggregatedCategoryController {

  static async getAggregatedCategoriesAdmin(req, res) {

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

    const categories = await AggregatedCategoriesService.getAggregatedCategoriesAdmin();
    // console.log(JSON.stringify(categories, null, 2));
    res.status(200).render('admin/categories', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      ...categories,
    });

  }

}

export default AggregatedCategoryController;
