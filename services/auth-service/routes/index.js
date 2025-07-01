import { Router } from "express";

// Import des middlewares
import authorization from "../middlewares/authorization.js";
import validateData from "../middlewares/validations.js";

// Import des gestionnaires de contrôleurs
import controllerHandler from "../handlers/controllers.js";

// Import des contrôleurs
import authController from "../controllers/auth.js";
import UserController from "../controllers/UserController.js";
import RoleController from "../controllers/RoleController.js";
import PermissionController from "../controllers/PermissionController.js";
import UserRoleController from "../controllers/UserRoleController.js";
import UserPermissionController from "../controllers/UserPermissionController.js";

// Import des schémas de validation
import {
  signinSchema,
  signinValidateSchema,
  signupSchema,
  signupValidateSchema,
  changePasswordSchema,
} from "../validations/auth.js";

import {
  getUserByIdSchema,
  createUserSchema,
  updateUserByIdParamsSchema,
  updateUserByIdBodySchema,
  deleteUserByIdSchema,
  getUserRolesByIdSchema,
  createUserRoleSchema,
  deleteUserRoleSchema,
  getUserPermissionsByIdSchema,
  createUserPermissionSchema,
  deleteUserPermissionSchema,
  getUsersSchema,
} from "../validations/users.js";

import {
  getRoleByIdSchema,
  createRoleSchema,
  updateRoleByIdParamsSchema,
  updateRoleByIdBodySchema,
  deleteRoleByIdSchema,
  getRolesSchema,
} from "../validations/roles.js";

import {
  getPermissionByIdSchema,
  createPermissionSchema,
  updatePermissionByIdParamsSchema,
  updatePermissionByIdBodySchema,
  deletePermissionByIdSchema,
  getPermissionsSchema,
} from "../validations/permissions.js";

// Import des exceptions
import NotFoundError from "../exceptions/NotFoundError.js";

const router = Router();

// Routes pour l'authentification
router.post(
  "/auth/signup",
  validateData(signupSchema, "body"),
  controllerHandler(authController.signup)
);

router.post(
  "/auth/signupValidate",
  validateData(signupValidateSchema, "body"),
  controllerHandler(authController.signupValidate)
);

router.post(
  "/auth/changePassword",
  validateData(changePasswordSchema, "body"),
  controllerHandler(authController.changePassword)
);

router.post(
  "/auth/signin",
  validateData(signinSchema, "body"),
  controllerHandler(authController.signin)
);

router.post(
  "/auth/signinValidate",
  validateData(signinValidateSchema, "body"),
  controllerHandler(authController.signinValidate)
);

router.get(
  "/auth/verify",
  controllerHandler(authController.verifyTokens)
);

router.get(
  "/auth/logout",
  controllerHandler(authController.logout)
);

router.get(
  "/auth/generate",
  controllerHandler(authController.generate)
);

// Routes pour les utilisateurs
router.get(
  "/users",
  authorization([], ["admin"]),
  validateData(getUsersSchema, "query"),
  controllerHandler(UserController.getUsers)
);
router.get(
  "/users/:id",
  authorization([], ["admin"]),
  validateData(getUserByIdSchema, "params"),
  controllerHandler(UserController.getUserById)
);
router.post(
  "/users",
  authorization([], ["admin"]),
  validateData(createUserSchema, "body"),
  controllerHandler(UserController.createUser)
);
router.put(
  "/users/:id",
  authorization([], ["admin"]),
  validateData(updateUserByIdParamsSchema, "params"),
  validateData(updateUserByIdBodySchema, "body"),
  controllerHandler(UserController.updateUserById)
);
router.delete(
  "/users/:id",
  authorization([], ["superadmin"]),
  validateData(deleteUserByIdSchema, "params"),
  controllerHandler(UserController.deleteUserById)
);

// Routes pour les rôles
router.get(
  "/roles",
  authorization([], ["admin"]),
  validateData(getRolesSchema, "query"),
  controllerHandler(RoleController.getRoles)
);
router.get(
  "/roles/:id",
  authorization([], ["admin"]),
  validateData(getRoleByIdSchema, "params"),
  controllerHandler(RoleController.getRoleById)
);
router.post(
  "/roles",
  authorization([], ["admin"]),
  validateData(createRoleSchema, "body"),
  controllerHandler(RoleController.createRole)
);
router.put(
  "/roles/:id",
  authorization([], ["admin"]),
  validateData(updateRoleByIdParamsSchema, "params"),
  validateData(updateRoleByIdBodySchema, "body"),
  controllerHandler(RoleController.updateRoleById)
);
router.delete(
  "/roles/:id",
  authorization([], ["superadmin"]),
  validateData(deleteRoleByIdSchema, "params"),
  controllerHandler(RoleController.deleteRoleById)
);

// Routes pour les permissions
router.get(
  "/permissions",
  authorization([], ["admin"]),
  validateData(getPermissionsSchema, "query"),
  controllerHandler(PermissionController.getPermissions)
);
router.get(
  "/permissions/:id",
  authorization([], ["admin"]),
  validateData(getPermissionByIdSchema, "params"),
  controllerHandler(PermissionController.getPermissionById)
);
router.post(
  "/permissions",
  authorization([], ["admin"]),
  validateData(createPermissionSchema, "body"),
  controllerHandler(PermissionController.createPermission)
);
router.put(
  "/permissions/:id",
  authorization([], ["admin"]),
  validateData(updatePermissionByIdParamsSchema, "params"),
  validateData(updatePermissionByIdBodySchema, "body"),
  controllerHandler(PermissionController.updatePermissionById)
);
router.delete(
  "/permissions/:id",
  authorization([], ["superadmin"]),
  validateData(deletePermissionByIdSchema, "params"),
  controllerHandler(PermissionController.deletePermissionById)
);

// Routes pour les roles des utilisateurs
router.get(
  "/users/:userId/roles",
  authorization([], ["admin"]),
  validateData(getUserRolesByIdSchema, "params"),
  controllerHandler(UserRoleController.getUserRoles)
);
router.post(
  "/users/roles",
  authorization([], ["admin"]),
  validateData(createUserRoleSchema, "body"),
  controllerHandler(UserRoleController.assignRoleToUser)
);
router.delete(
  "/users/:userId/roles/:roleId",
  authorization([], ["superadmin"]),
  validateData(deleteUserRoleSchema, "params"),
  controllerHandler(UserRoleController.removeRoleFromUser)
);

// Routes pour les permissions des utilisateurs
router.get(
  "/users/:userId/permissions",
  authorization([], ["admin"]),
  validateData(getUserPermissionsByIdSchema, "params"),
  controllerHandler(UserPermissionController.getUserPermissions)
);
router.post(
  "/users/permissions",
  authorization([], ["admin"]),
  validateData(createUserPermissionSchema, "body"),
  controllerHandler(UserPermissionController.assignPermissionToUser)
);
router.delete(
  "/users/:userId/permissions/:permissionId",
  authorization([], ["superadmin"]),
  validateData(deleteUserPermissionSchema, "params"),
  controllerHandler(UserPermissionController.removePermissionFromUser)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
