import { z } from 'zod';
import xss from 'xss';

// Schéma de base pour une chaîne nettoyée
export const safeString = z.string().trim().transform((val) => xss(val));
