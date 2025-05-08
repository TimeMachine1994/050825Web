import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Load, LoadEvent } from '@sveltejs/kit';

/**
 * Higher-order function that wraps a load function to require authentication
 * @param load The original load function (optional)
 * @param redirectTo Where to redirect if not authenticated
 * @returns A new load function that checks authentication
 */
export function requireAuth(load?: Load, redirectTo = '/login'): Load {
  return async (event) => {
    // Check if the user is authenticated
    const token = browser ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw redirect(302, redirectTo);
    }
    
    try {
      // If we have a load function, call it with the token
      if (load) {
        const result = await load(event);
        return {
          ...result,
          authenticated: true
        };
      }
      
      // Otherwise, return a simple authenticated flag
      return {
        authenticated: true
      };
    } catch (err) {
      // If there's an error, redirect to login
      throw redirect(302, redirectTo);
    }
  };
}