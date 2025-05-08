import { z } from 'zod';

/**
 * Login form schema
 */
export const loginSchema = z.object({
  identifier: z.string({ required_error: 'Email or username is required' })
    .min(1, 'Email or username is required'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});

/**
 * Registration form schema
 */
export const registerSchema = z.object({
  username: z.string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .email('Invalid email address')
});

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z.object({
  password: z.string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  passwordConfirmation: z.string({ required_error: 'Password confirmation is required' }),
  code: z.string({ required_error: 'Reset code is required' })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});