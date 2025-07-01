import { z } from 'zod';
import { safeString } from '../../../shared/validations/communs.js';

const actionEnum = z.enum(['IN', 'OUT', 'ADJUSTMENT'], {
  errorMap: () => ({ message: 'Action must be one of: IN, OUT, ADJUSTMENT' }),
});

export const getStocksHistorySchema = z.object({
  limit: z.coerce.number().positive("La limite doit être un nombre positif").default(20).optional(),
  offset: z.coerce.number().nonnegative("Le décalage doit être un nombre positif ou zéro").default(0).optional(),
});

// Validation pour : GET /stock-history/:id
export const getHistorySchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

// Validation pour : GET /stocks/:productId/history
export const getProductHistorySchema = z.object({
  productId: z.coerce.number().positive("Le productId doit être un nombre positif"),
});

// Validation pour : POST /stock-history/:productId
export const createHistorySchema = z.object({
  productId: z.number().positive("Le productId doit être un nombre positif"),
  storeId: z.number().positive("Le storeId doit être un nombre positif"),
  action: actionEnum,
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number',
  }),
  comment: safeString().optional(),
});

export const updateHistoryIdSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

// Validation pour : PUT /stock-history/:id
export const updateHistorySchema = z.object({
  productId: z.number().positive("Le productId doit être un nombre positif").optional(),
  storeId: z.number().positive("Le storeId doit être un nombre positif").optional(),
  action: actionEnum.optional(),
  quantity: z.number().optional(),
  comment: safeString().optional(),
});

// Validation pour : DELETE /stock-history/:id
export const deleteHistorySchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
