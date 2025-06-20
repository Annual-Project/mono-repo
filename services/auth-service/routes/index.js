import { Router } from 'express';

import validateData from '../middlewares/validations.js';
import controllerHandler from '../handlers/controllers.js';

import authController from '../controllers/auth.js';
import UserController from '../controllers/UserController.js';
import RoleController from '../controllers/RoleController.js';
import PermissionController from '../controllers/PermissionController.js';
import UserRoleController from '../controllers/UserRoleController.js';
import UserPermissionController from '../controllers/UserPermissionController.js';

import {
  signinSchema,
  signinValidateSchema,
  signupSchema,
  signupValidateSchema,
  changePasswordSchema,
} from '../validations/auth.js';

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
} from '../validations/users.js';

import {
  getRoleByIdSchema,
  createRoleSchema,
  updateRoleByIdParamsSchema,
  updateRoleByIdBodySchema,
  deleteRoleByIdSchema,
} from '../validations/roles.js';

import {
  getPermissionByIdSchema,
  createPermissionSchema,
  updatePermissionByIdParamsSchema,
  updatePermissionByIdBodySchema,
  deletePermissionByIdSchema,
} from '../validations/permissions.js';

import NotFoundError from '../exceptions/NotFoundError.js';

const router = Router();

// Routes pour l'authentification
router.post('/auth/signup', validateData(signupSchema, 'body'), controllerHandler(authController.signup));

router.post('/auth/signupValidate', validateData(signupValidateSchema, 'body'), controllerHandler(authController.signupValidate));

router.post('/auth/changePassword', validateData(changePasswordSchema, 'body'), controllerHandler(authController.changePassword));

router.post('/auth/signin', validateData(signinSchema, 'body'), controllerHandler(authController.signin));

router.post('/auth/signinValidate', validateData(signinValidateSchema, 'body'), controllerHandler(authController.signinValidate));

router.get('/auth/verify', controllerHandler(authController.verifyTokens));

router.get('/auth/logout', controllerHandler(authController.logout));

router.get('/auth/generate', controllerHandler(authController.generate));

// Routes pour les utilisateurs
router.get('/users', controllerHandler(UserController.getUsers));
router.get('/users/:id', validateData(getUserByIdSchema, 'params'), controllerHandler(UserController.getUserById));
router.post('/users', validateData(createUserSchema, 'body'), controllerHandler(UserController.createUser));
router.put('/users/:id', validateData(updateUserByIdParamsSchema, 'params'), validateData(updateUserByIdBodySchema, 'body'), controllerHandler(UserController.updateUserById));
router.delete('/users/:id', validateData(deleteUserByIdSchema, 'params'), controllerHandler(UserController.deleteUserById));

// Routes pour les rôles
router.get('/roles', controllerHandler(RoleController.getRoles));
router.get('/roles/:id', validateData(getRoleByIdSchema, 'params'), controllerHandler(RoleController.getRoleById));
router.post('/roles', validateData(createRoleSchema, 'body'), controllerHandler(RoleController.createRole));
router.put('/roles/:id', validateData(updateRoleByIdParamsSchema, 'params'), validateData(updateRoleByIdBodySchema, 'body'), controllerHandler(RoleController.updateRoleById));
router.delete('/roles/:id', validateData(deleteRoleByIdSchema, 'params'), controllerHandler(RoleController.deleteRoleById));

// Routes pour les permissions
router.get('/permissions', controllerHandler(PermissionController.getPermissions));
router.get('/permissions/:id', validateData(getPermissionByIdSchema, 'params'), controllerHandler(PermissionController.getPermissionById));
router.post('/permissions', validateData(createPermissionSchema, 'body'), controllerHandler(PermissionController.createPermission));
router.put('/permissions/:id', validateData(updatePermissionByIdParamsSchema, 'params'), validateData(updatePermissionByIdBodySchema, 'body'), controllerHandler(PermissionController.updatePermissionById));
router.delete('/permissions/:id', validateData(deletePermissionByIdSchema, 'params'), controllerHandler(PermissionController.deletePermissionById));

// Routes pour les roles des utilisateurs
router.get('/users/:userId/roles', validateData(getUserRolesByIdSchema, 'params'), controllerHandler(UserRoleController.getUserRoles));
router.post('/users/roles', validateData(createUserRoleSchema, 'body'), controllerHandler(UserRoleController.assignRoleToUser));
router.delete('/users/:userId/roles/:roleId', validateData(deleteUserRoleSchema, 'params'), controllerHandler(UserRoleController.removeRoleFromUser));

// Routes pour les permissions des utilisateurs
router.get('/users/:userId/permissions', validateData(getUserPermissionsByIdSchema, 'params'), controllerHandler(UserPermissionController.getUserPermissions));
router.post('/users/permissions', validateData(createUserPermissionSchema, 'body'), controllerHandler(UserPermissionController.assignPermissionToUser));
router.delete('/users/:userId/permissions/:permissionId', validateData(deleteUserPermissionSchema, 'params'), controllerHandler(UserPermissionController.removePermissionFromUser));

// Dans le cas où aucune route ne correspond, on renvoie une erreur 404
router.use((_, __, next) => {
  next(
    new NotFoundError('Resource not found'),
  );
});

export default router;