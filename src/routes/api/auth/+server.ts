import { json, error } from '@sveltejs/kit';
import { authAPI } from '$lib/api';
import type { RequestHandler } from './$types';

// POST /api/auth - Handle login
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Call the Strapi login API
    const response = await authAPI.login({
      identifier: body.identifier,
      password: body.password
    });

    // Set JWT token cookie
    cookies.set('jwt', response.jwt, {
      path: '/',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Return user data without exposing JWT to client
    return json({
      user: response.user,
      success: true
    });
  } catch (err: any) {
    console.error('Login error:', err);
    throw error(err.status || 500, err.message || 'Login failed');
  }
};