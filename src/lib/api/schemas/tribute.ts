import { z } from 'zod';

/**
 * Tribute base schema
 */
export const tributeSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .min(1, 'Tribute name is required'),
  slug: z.string({ required_error: 'Slug is required' })
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  owner: z.number().optional()
});

/**
 * Create tribute schema (required fields)
 */
export const createTributeSchema = tributeSchema;

/**
 * Update tribute schema (all fields optional)
 */
export const updateTributeSchema = tributeSchema.partial();

/**
 * Filter tribute schema for searching
 */
export const filterTributeSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  owner: z.number().optional(),
  sort: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional()
});