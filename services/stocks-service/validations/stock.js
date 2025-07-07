import { z } from 'zod';

export const getStocksSchema = z.object({
  limit: z.coerce.number().positive("La limite doit être un nombre positif").default(20).optional(),
  offset: z.coerce.number().nonnegative("Le décalage doit être un nombre positif ou zéro").default(0).optional(),
});

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
  criticalThreshold: z.number({
    required_error: 'Critical threshold is required',
    invalid_type_error: 'Critical threshold must be a number',
  }).optional().default(10),
});

export const updateStockIdSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const updateStockSchema = z.object({
  productId: z.number().positive('Product ID must be a positive number').optional(),
  storeId: z.number().positive('Store ID must be a positive number').optional(),
  quantityAvailable: z.number({
    required_error: 'Quantity available is required',
    invalid_type_error: 'Quantity available must be a number',
  }).positive('Quantity available must be a positive number').optional(),
  criticalThreshold: z.number({
    required_error: 'Critical threshold is required',
    invalid_type_error: 'Critical threshold must be a number',
  }).optional().default(10),
});

export const deleteStockSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
