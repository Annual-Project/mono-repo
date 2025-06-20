import {  z } from 'zod';

export const getRoleByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
});

export const updateRoleByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const updateRoleByIdBodySchema = z.object({
  name: z.string().min(1, 'Role name is required').optional(),
  description: z.string().optional(),
});

export const deleteRoleByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});
