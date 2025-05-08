import { z } from 'zod';

/**
 * File upload schema - client side only since File is not serializable
 */
export const fileUploadSchema = z.object({
  files: z.any(), // Will check instanceof File in runtime validation
  refId: z.string().or(z.number()).optional(),
  ref: z.string().optional(),
  field: z.string().optional(),
  path: z.string().optional()
});

/**
 * Client-side validation function since zod can't properly check File instances in isomorphic code
 */
export function validateFileUpload(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const { files } = data as { files?: unknown };
  
  if (!files) return false;
  
  if (Array.isArray(files)) {
    return files.every(file => file instanceof File);
  }
  
  return files instanceof File;
}

/**
 * File query schema
 */
export const fileQuerySchema = z.object({
  id: z.string().or(z.number())
});