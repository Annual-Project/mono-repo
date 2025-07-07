import { Router } from "express";

// Import des middlewares
import authorizationMiddleware from "../middlewares/authorizationMiddleware.js";
import validationsMiddleware from "../middlewares/validationsMiddleware.js";

// Import des gestionnaires de contrôleurs
import controllersHandler from "../handlers/controllersHandler.js";

// Import des contrôleurs
import AuthController from "../controllers/authController.js";
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
  getUsersByRoleSchema,
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
  "/api/v1/auth/signup",
  validationsMiddleware(signupSchema, "body"),
  controllersHandler(AuthController.signup)
);

router.post(
  "/api/v1/auth/signupValidate",
  validationsMiddleware(signupValidateSchema, "body"),
  controllersHandler(AuthController.signupValidate)
);

router.post(
  "/api/v1/auth/changePassword",
  validationsMiddleware(changePasswordSchema, "body"),
  controllersHandler(AuthController.changePassword)
);

router.post(
  "/api/v1/auth/signin",
  validationsMiddleware(signinSchema, "body"),
  controllersHandler(AuthController.signin)
);

router.post(
  "/api/v1/auth/signinValidate",
  validationsMiddleware(signinValidateSchema, "body"),
  controllersHandler(AuthController.signinValidate)
);

router.get(
  "/api/v1/auth/verify",
  controllersHandler(AuthController.verifyTokens)
);

router.get(
  "/api/v1/auth/logout",
  controllersHandler(AuthController.logout)
);

router.get(
  "/api/v1/auth/generate",
  controllersHandler(AuthController.generate)
);

// Routes pour les utilisateurs
router.get(
  "/api/v1/users",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getUsersSchema, "query"),
  controllersHandler(UserController.getUsers)
);
router.get(
  "/api/v1/users/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getUserByIdSchema, "params"),
  controllersHandler(UserController.getUserById)
);
router.get(
  "/api/v1/users/role/:roleName",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getUsersByRoleSchema, "params"),
  validationsMiddleware(getUsersSchema, "query"),
  controllersHandler(UserController.getUsersByRole)
);
router.post(
  "/api/v1/users",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createUserSchema, "body"),
  controllersHandler(UserController.createUser)
);
router.put(
  "/api/v1/users/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateUserByIdParamsSchema, "params"),
  validationsMiddleware(updateUserByIdBodySchema, "body"),
  controllersHandler(UserController.updateUserById)
);
router.delete(
  "/api/v1/users/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteUserByIdSchema, "params"),
  controllersHandler(UserController.deleteUserById)
);

// Routes pour les rôles
router.get(
  "/api/v1/roles",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getRolesSchema, "query"),
  controllersHandler(RoleController.getRoles)
);
router.get(
  "/api/v1/roles/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getRoleByIdSchema, "params"),
  controllersHandler(RoleController.getRoleById)
);
router.post(
  "/api/v1/roles",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createRoleSchema, "body"),
  controllersHandler(RoleController.createRole)
);
router.put(
  "/api/v1/roles/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updateRoleByIdParamsSchema, "params"),
  validationsMiddleware(updateRoleByIdBodySchema, "body"),
  controllersHandler(RoleController.updateRoleById)
);
router.delete(
  "/api/v1/roles/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteRoleByIdSchema, "params"),
  controllersHandler(RoleController.deleteRoleById)
);

// Routes pour les permissions
router.get(
  "/api/v1/permissions",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getPermissionsSchema, "query"),
  controllersHandler(PermissionController.getPermissions)
);
router.get(
  "/api/v1/permissions/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getPermissionByIdSchema, "params"),
  controllersHandler(PermissionController.getPermissionById)
);
router.post(
  "/api/v1/permissions",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createPermissionSchema, "body"),
  controllersHandler(PermissionController.createPermission)
);
router.put(
  "/api/v1/permissions/:id",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(updatePermissionByIdParamsSchema, "params"),
  validationsMiddleware(updatePermissionByIdBodySchema, "body"),
  controllersHandler(PermissionController.updatePermissionById)
);
router.delete(
  "/api/v1/permissions/:id",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deletePermissionByIdSchema, "params"),
  controllersHandler(PermissionController.deletePermissionById)
);

// Routes pour les roles des utilisateurs
router.get(
  "/api/v1/users/:userId/roles",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getUserRolesByIdSchema, "params"),
  controllersHandler(UserRoleController.getUserRoles)
);
router.post(
  "/api/v1/users/roles",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createUserRoleSchema, "body"),
  controllersHandler(UserRoleController.assignRoleToUser)
);
router.delete(
  "/api/v1/users/:userId/roles/:roleId",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteUserRoleSchema, "params"),
  controllersHandler(UserRoleController.removeRoleFromUser)
);

// Routes pour les permissions des utilisateurs
router.get(
  "/api/v1/users/:userId/permissions",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(getUserPermissionsByIdSchema, "params"),
  controllersHandler(UserPermissionController.getUserPermissions)
);
router.post(
  "/api/v1/users/permissions",
  authorizationMiddleware([], ["admin"]),
  validationsMiddleware(createUserPermissionSchema, "body"),
  controllersHandler(UserPermissionController.assignPermissionToUser)
);
router.delete(
  "/api/v1/users/:userId/permissions/:permissionId",
  authorizationMiddleware([], ["superadmin"]),
  validationsMiddleware(deleteUserPermissionSchema, "params"),
  controllersHandler(UserPermissionController.removePermissionFromUser)
);

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(new NotFoundError("Resource not found"));
});

export default router;
