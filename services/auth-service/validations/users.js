import { z } from 'zod';
import { safeString, safeStringEmail } from '../../../shared/validations/communs.js';

export const getUsersSchema = z.object({
  limit: z.coerce.number().positive('Limit must be a positive number').default(20).optional(),
  offset: z.coerce.number().nonnegative('Offset must be a non-negative number').default(0).optional(),
});

export const getUserByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createUserSchema = z.object({
  firstname: safeString(1),
  lastname: safeString(1),
  email: safeStringEmail(),
  hashPassword: z.string('Password is required'),
  salt: z.string('Salt is required'),
  isActive: z.boolean().optional(),
});

export const updateUserByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const updateUserByIdBodySchema = z.object({
  firstname: safeString(1).optional(),
  lastname: safeString(1).optional(),
  email: safeStringEmail().optional(),
  hashPassword: safeString().optional(),
  salt: safeString().optional(),
  isActive: z.boolean().optional(),
});

export const deleteUserByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

// Schemas for User Roles
export const getUserRolesByIdSchema = z.object({
  userId: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createUserRoleSchema = z.object({
  userId: z.coerce.number().int().positive('User ID must be a positive integer'),
  roleId: z.coerce.number().int().positive('Role ID must be a positive integer'),
});

export const deleteUserRoleSchema = z.object({
  userId: z.coerce.number().int().positive('User ID must be a positive integer'),
  roleId: z.coerce.number().int().positive('Role ID must be a positive integer'),
});

// Schemas for User Permissions
export const getUserPermissionsByIdSchema = z.object({
  userId: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createUserPermissionSchema = z.object({
  userId: z.coerce.number().int().positive('User ID must be a positive integer'),
  permissionId: z.coerce.number().int().positive('Permission ID must be a positive integer'),
});

export const deleteUserPermissionSchema = z.object({
  userId: z.coerce.number().int().positive('User ID must be a positive integer'),
  permissionId: z.coerce.number().int().positive('Permission ID must be a positive integer'),
});
