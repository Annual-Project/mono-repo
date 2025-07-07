import { z } from 'zod';
import { safeString } from '../../../shared/validations/communs.js';

export const getProductsSchema = z.object({
  limit: z.coerce.number().positive('La limite doit être un nombre positif').default(20).optional(),
  offset: z.coerce.number().nonnegative('Le décalage doit être un nombre positif ou zéro').default(0).optional(),
});

export const getProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const createProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
  name: safeString(1),
  description: safeString(1).optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  categoryId: z.number().positive().optional(),
});

export const updateProductIdSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const updateProductSchema = z.object({
  name: safeString(1).optional(),
  description: safeString(1).optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  categoryId: z.number().positive().optional(),
});

export const deleteProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});
