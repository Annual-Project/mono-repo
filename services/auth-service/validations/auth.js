import { z } from 'zod';
import { safeString, safeStringEmail } from '../../../shared/validations/communs.js';

export const signinSchema = z.object({
  email: safeStringEmail(),
});

export const signinValidateSchema = z.object({
  email: safeStringEmail(),
  hashPassword: safeString(),
  challenge: safeString(),
  proof: z.number().nonnegative(),
  signature: safeString(),
});

export const signupSchema = z.object({
  email: safeStringEmail(),
});

export const signupValidateSchema = z.object({
  email: safeStringEmail(),
  firstname: safeString(),
  lastname: safeString(),
  hashPassword: safeString(),
  challenge: safeString(),
  proof: z.number().nonnegative(),
  signature: safeString(),
});

export const changePasswordSchema = z.object({
  email: safeStringEmail(),
  hashOldPassword: safeString(),
  hashNewPassword: safeString(),
  hashNewConfirmPassword: safeString(),
  challenge: safeString(),
  newSalt: safeString(),
  proof: z.number().nonnegative(),
  signature: safeString(),
});
