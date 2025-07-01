import {  z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email(),
});

export const signinValidateSchema = z.object({
  email: z.string().email(),
  hashPassword: z.string(),
  challenge: z.string(),
  proof: z.number().nonnegative(),
  signature: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email(),
});

export const signupValidateSchema = z.object({
  email: z.string().email(),
  hashPassword: z.string(),
  challenge: z.string(),
  proof: z.number().nonnegative(),
  signature: z.string(),
});

export const changePasswordSchema = z.object({
  email: z.string().email(),
  hashOldPassword: z.string(),
  hashNewPassword: z.string(),
  hashNewConfirmPassword: z.string(),
  challenge: z.string(),
  newSalt: z.string(),
  proof: z.number().nonnegative(),
  signature: z.string(),
});
