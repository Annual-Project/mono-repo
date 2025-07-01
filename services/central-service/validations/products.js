import { z } from 'zod';

export const getProductsSchema = z.object({
  limit: z.coerce.number().positive('La limite doit être un nombre positif').default(20).optional(),
  offset: z.coerce.number().nonnegative('Le décalage doit être un nombre positif ou zéro').default(0).optional(),
});

export const getProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  categoryId: z.number().positive().optional(),
});

export const updateProductIdSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  categoryId: z.number().positive().optional(),
});

export const deleteProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});
