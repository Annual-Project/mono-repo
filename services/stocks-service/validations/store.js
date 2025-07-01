import { z } from 'zod';
import { safeString } from '../../../shared/validations/communs.js';

export const getStoresSchema = z.object({
  limit: z.coerce.number().positive("La limite doit être un nombre positif").default(20).optional(),
  offset: z.coerce.number().nonnegative("Le décalage doit être un nombre positif ou zéro").default(0).optional(),
});

export const getStoreSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const createStoreSchema = z.object({
    name: safeString.min(1, "Le nom doit être renseigné"),
    description: safeString.optional(),
});

export const updateStoreIdSchema = z.object({
    id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const updateStoreSchema = z.object({
    name: safeString.min(1, "Le nom doit être renseigné").optional(),
    description: safeString.optional(),
});

export const deleteStoreSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
