import { fail, redirect } from '@sveltejs/kit';
import { authClient } from '$lib/api';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const email = data.get('email')?.toString() || '';
    const password = data.get('password')?.toString() || '';
    const rememberMe = data.get('remember-me') === 'on';

    // Validate form data
    const errors: Record<string, string> = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, email });
    }

    try {
      // Attempt to login
      const response = await authClient.login({ identifier: email, password }, event);
      
      // Set the JWT token in a cookie
      event.cookies.set('jwt', response.jwt, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days if remember me, otherwise 1 day
      });
      
      // Get the redirect URL from the query string or default to dashboard
      const redirectTo = event.url.searchParams.get('redirectTo') || '/dashboard';
      
      // Redirect to the dashboard or the requested page
      throw redirect(303, redirectTo);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Return the error message
      return fail(error.status || 400, {
        errors: {
          form: error.message || 'Invalid credentials. Please try again.'
        },
        email
      });
    }
  }
};