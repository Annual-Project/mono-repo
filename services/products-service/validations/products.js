import { z } from 'zod';

export const getProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  categoryId: z.number().positive().optional(),
});

export const updateProductSchema = z.object({
  id: z.number().positive('L\'id doit être un nombre positif'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  categoryId: z.number().positive().optional(),
});

export const deleteProductSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});
