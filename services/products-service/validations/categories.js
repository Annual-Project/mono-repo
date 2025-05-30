import {  z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').required(),
  description: z.string().min(1, 'Description is required').optional(),
});

export const updateCategorySchema = z.object({
  id: z.number().positive().required(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
});

export const deleteCategorySchema = z.object({
  id: z.number().positive().required(),
});
