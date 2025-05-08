import { z } from 'zod';

/**
 * Funeral home base schema
 */
export const funeralHomeSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .min(1, 'Funeral home name is required'),
  address: z.string({ required_error: 'Address is required' })
    .min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().max(2, 'Please use two-letter state code').optional(),
  zipCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format')
    .optional(),
  phoneNumber: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$|^\d{10}$/, 'Invalid phone number format')
    .optional(),
  directors: z.array(z.number()).optional()
});

/**
 * Create funeral home schema (required fields)
 */
export const createFuneralHomeSchema = funeralHomeSchema;

/**
 * Update funeral home schema (all fields optional)
 */
export const updateFuneralHomeSchema = funeralHomeSchema.partial();

/**
 * Filter funeral home schema for searching
 */
export const filterFuneralHomeSchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional()
});