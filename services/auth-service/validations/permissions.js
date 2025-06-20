import {  z } from 'zod';

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
