import { z } from 'zod';

export const getTransfersSchema = z.object({
  limit: z.coerce.number().positive("La limite doit être un nombre positif").default(20).optional(),
  offset: z.coerce.number().nonnegative("Le décalage doit être un nombre positif ou zéro").default(0).optional(),
});

export const getTransferSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const createTransferSchema = z.object({
  productId: z.number().positive("productId est requis"),
  sourceStoreId: z.number().positive("sourceStoreId est requis"),
  destinationStoreId: z.number().positive("destinationStoreId est requis"),
  quantity: z.number().positive("quantity doit être un entier positif"),
  status: z.string().min(1, "status est requis"),
  comment: z.string().optional(),
});

export const updateTransferIdSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const updateTransferSchema = z.object({
  productId: z.number().positive("productId est requis").optional(),
  sourceStoreId: z.number().positive("sourceStoreId est requis").optional(),
  destinationStoreId: z.number().positive("destinationStoreId est requis").optional(),
  quantity: z.number().positive("quantity doit être un entier positif").optional(),
  status: z.string().min(1, "status est requis").optional(),
  comment: z.string().optional(),
});

export const deleteTransferSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
