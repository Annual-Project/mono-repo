import { z } from 'zod';

export const getStockSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const createStockSchema = z.object({
  productId: z.number({
    required_error: 'Product ID is required',
    invalid_type_error: 'Product ID must be a number',
  }).positive('Product ID must be a positive number'),
  storeId: z.number({
    required_error: 'Store ID is required',
    invalid_type_error: 'Store ID must be a number',
  }).positive('Store ID must be a positive number'),
  quantityAvailable: z.number({
    required_error: 'Quantity available is required',
    invalid_type_error: 'Quantity available must be a number',
  }).positive('Quantity available must be a positive number'),
  criticalThreshold: z.boolean().optional().default(false).describe('Indicates if the stock is below the critical threshold'),
});

export const updateStockSchema = z.object({
  id: z.number().positive("L'id doit être un nombre positif"),
  productId: z.number().positive('Product ID must be a positive number').optional(),
  storeId: z.number().positive('Store ID must be a positive number').optional(),
  quantityAvailable: z.number().optional(),
  criticalThreshold: z.boolean().optional().default(false).describe('Indicates if the stock is below the critical threshold'),
});

export const deleteStockSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
