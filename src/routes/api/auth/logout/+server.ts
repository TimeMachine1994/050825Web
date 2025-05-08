import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/auth/logout - Handle logout
export const POST: RequestHandler = async ({ cookies }) => {
  // Clear JWT token cookie
  cookies.delete('jwt', { path: '/' });

  // Return success response
  return json({
    success: true
  });
};

// GET /api/auth/logout - Also handle logout with GET for convenience
export const GET: RequestHandler = async ({ cookies }) => {
  // Clear JWT token cookie
  cookies.delete('jwt', { path: '/' });

  // Return success response
  return json({
    success: true
  });
};