import {  z } from 'zod';

export const getCategoriesSchema = z.object({
  limit: z.coerce.number().positive('La limite doit être un nombre positif').default(20).optional(),
  offset: z.coerce.number().nonnegative('Le décalage doit être un nombre positif ou zéro').default(0).optional(),
});

export const getCategorySchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
});

export const updateCategoryIdSchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});

export const deleteCategorySchema = z.object({
  id: z.coerce.number().positive('L\'id doit être un nombre positif'),
});
