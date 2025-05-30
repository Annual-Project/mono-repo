import {  z } from 'zod';

export const getCategorySchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
});

export const updateCategorySchema = z.object({
  id: z.number().positive('L\'id doit être un nombre positif'),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});

export const deleteCategorySchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});
