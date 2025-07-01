import { z } from 'zod';
import xss from 'xss';

// Schéma de base pour une chaîne nettoyée
export const safeString = (minLength = 1) =>
  z.string()
    .trim()
    .min(minLength, `La chaîne doit contenir au moins ${minLength} caractère(s)`)
    .transform((val) => xss(val));

export const safeStringEmail = (minLength = 1) =>
  z.string()
    .trim()
    .email("L'email doit être valide")
    .transform((val) => xss(val));
