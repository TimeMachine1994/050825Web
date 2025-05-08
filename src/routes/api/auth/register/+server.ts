import { json, error } from '@sveltejs/kit';
import { authAPI } from '$lib/api';
import type { RequestHandler } from './$types';

// POST /api/auth/register - Handle registration
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Call the Strapi register API
    const response = await authAPI.register({
      username: body.username,
      email: body.email,
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
    console.error('Registration error:', err);
    throw error(err.status || 500, err.message || 'Registration failed');
  }
};