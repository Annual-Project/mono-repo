import { z } from 'zod';

export const getPermissionsSchema = z.object({
  limit: z.coerce.number().positive('Limit must be a positive number').default(20).optional(),
  offset: z.coerce.number().nonnegative('Offset must be a non-negative number').default(0).optional(),
});

export const getPermissionByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createPermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
});

export const updatePermissionByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const updatePermissionByIdBodySchema = z.object({
  name: z.string().min(1, 'Permission name is required').optional(),
  description: z.string().optional(),
});

export const deletePermissionByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});
