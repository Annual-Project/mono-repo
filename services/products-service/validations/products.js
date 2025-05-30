import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').required(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').required(),
  category: z.number().positive().optional(),
});

export const updateProductSchema = z.object({
  id: z.number().positive().required(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  category: z.number().positive().optional(),
});

export const deleteProductSchema = z.object({
  id: z.number().positive().required(),
});
