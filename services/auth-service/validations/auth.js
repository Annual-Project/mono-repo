import { z } from 'zod';
import { safeString } from '../../../shared/validations/communs.js';

export const signinSchema = z.object({
  email: safeString.email(),
});

export const signinValidateSchema = z.object({
  email: safeString.email(),
  hashPassword: safeString,
  challenge: safeString,
  proof: z.number().nonnegative(),
  signature: safeString,
});

export const signupSchema = z.object({
  email: safeString.email(),
});

export const signupValidateSchema = z.object({
  email: safeString.email(),
  hashPassword: safeString,
  challenge: safeString,
  proof: z.number().nonnegative(),
  signature: safeString,
});

export const changePasswordSchema = z.object({
  email: safeString.email(),
  hashOldPassword: safeString,
  hashNewPassword: safeString,
  hashNewConfirmPassword: safeString,
  challenge: safeString,
  newSalt: safeString,
  proof: z.number().nonnegative(),
  signature: safeString,
});
