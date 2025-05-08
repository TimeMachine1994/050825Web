import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { z } from 'zod';

/**
 * Create API form handler
 * @param schema - Zod schema for validation
 * @param handler - Function to handle form submission
 */
export function createApiFormAction<T extends z.ZodType>(
  schema: T,
  handler: (data: z.infer<T>, event: RequestEvent) => Promise<any>
) {
  return async (event: RequestEvent) => {
    try {
      // Validate form data
      const form = await superValidate(event.request, zod(schema));

      // Check if form is valid
      if (!form.valid) {
        return fail(400, { form });
      }

      // Handle form submission
      const result = await handler(form.data, event);

      // Return the result with the form
      return { form, ...result };
    } catch (error: any) {
      console.error('API form action error:', error);
      
      // Return error with appropriate status code
      const status = error.status || 500;
      const message = error.message || 'An unexpected error occurred';
      
      return fail(status, { 
        form: { valid: false }, 
        error: true,
        message
      });
    }
  };
}

/**
 * Create API form handlers object for multiple actions
 * @param handlers - Object of named handlers
 */
export function createApiFormActions<T extends Record<string, any>>(handlers: {
  [K in keyof T]: {
    schema: z.ZodType;
    handler: (data: z.infer<T[K]['schema']>, event: RequestEvent) => Promise<any>;
  }
}) {
  const actions: Record<string, (event: RequestEvent) => Promise<any>> = {};
  
  for (const [key, { schema, handler }] of Object.entries(handlers)) {
    actions[key] = createApiFormAction(schema, handler);
  }
  
  return actions;
}