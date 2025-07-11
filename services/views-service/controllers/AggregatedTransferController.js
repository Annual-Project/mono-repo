import AggregatedTransferService from '../services/AggregatedTransferService.js';

import RolesStore from "../../../shared/stores/RolesStore.js";

class AggregatedTransferController {

  static async getAggregatedTransfersAdmin(req, res) {
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

    const transfers = await AggregatedTransferService.getAggregatedTransfersAdmin();
    // console.log(JSON.stringify(transfers, null, 2));
    res.status(200).render('admin/transfers', {
      user: user ? {
        ...user,
        admin: hasAdmin,
      } : null,
      ...transfers,
    });
  }

}

export default AggregatedTransferController;
