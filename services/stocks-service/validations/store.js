import { z } from 'zod';

export const getStoreSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});

export const createStoreSchema = z.object({
    name: z.string().min(1, "Le nom doit être renseigné"),
    description: z.string().optional(),
});

export const updateStoreSchema = z.object({
    id: z.number().positive("L'id doit être un nombre positif"),
    name: z.string().min(1, "Le nom doit être renseigné").optional(),
    description: z.string().optional(),
});

export const deleteStoreSchema = z.object({
  id: z.coerce.number().positive("L'id doit être un nombre positif"),
});
