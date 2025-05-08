import { json, error } from '@sveltejs/kit';
import { authAPI } from '$lib/api';
import type { RequestHandler } from './$types';

// GET /api/auth/check - Check authentication status
export const GET: RequestHandler = async ({ cookies }) => {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');

    // If no token, return not authenticated
    if (!token) {
      return json({
        authenticated: false,
        user: null
      });
    }

    // Call the Strapi API to get current user
    const response = await authAPI.getCurrentUser(token);

    // Return user data
    return json({
      authenticated: true,
      user: response.data
    });
  } catch (err: any) {
    // If authentication fails, don't throw an error, just return not authenticated
    console.error('Auth check error:', err);
    return json({
      authenticated: false,
      user: null
    });
  }
};