import { z } from 'zod';
import { safeString } from '../../../shared/validations/communs.js';

export const getRolesSchema = z.object({
  limit: z.coerce.number().positive('Limit must be a positive number').default(20).optional(),
  offset: z.coerce.number().nonnegative('Offset must be a non-negative number').default(0).optional(),
});

export const getRoleByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const createRoleSchema = z.object({
  name: safeString(1),
  description: safeString().optional(),
});

export const updateRoleByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const updateRoleByIdBodySchema = z.object({
  name: safeString(1).optional(),
  description: safeString().optional(),
});

export const deleteRoleByIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});
