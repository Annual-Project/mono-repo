import PermissionsStore from "../../../shared/stores/PermissionsStore.js";
import RolesStore from "../../../shared/stores/RolesStore.js";

import ForbiddenError from "../exceptions/ForbiddenError.js";

/**
 * Middleware d'autorisation qui vérifie les permissions et les rôles.
 * @param {Array<string>} requiredPermissions - Tableau des permissions requises.
 * @param {Array<string>} requiredRoles - Tableau des rôles requis.
 * @returns {Function} Middleware d'autorisation.
 */
export default (requiredPermissions = [], requiredRoles = []) => {

  return async (req, _, next) => {
    console.log("Authorization Middleware Triggered");
    console.log("req auth:", req.auth);
    const { userId = null } = req.auth || {};

    // Si l'utilisateur est un utilisateur interne, on ignore l'autorisation
    if (userId === "internal") {
      console.log("Internal API Key detected, skipping authorization");
      return next();
    }

    if (!userId) {
      return next(new ForbiddenError("User not authenticated"));
    }

    try {
      // Vérification des permissions dans Redis
      const userPermissions = await PermissionsStore.getPermissions(userId);
      console.log("User Permissions:", userPermissions);
      const hasPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );
      console.log("Has Permissions:", hasPermissions);

      if (!hasPermissions) {
        return next(new ForbiddenError("Insufficient permissions"));
      }

      // Vérification des rôles dans Redis
      const userRoles = await RolesStore.getRoles(userId);
      console.log("User Roles:", userRoles);
      const hasRoles = requiredRoles.every((role) =>
        userRoles.includes(role),
      );
      console.log("Has Roles:", hasRoles);

      if (!hasRoles) {
        return next(new ForbiddenError("Insufficient roles"));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

};
