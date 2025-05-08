import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authAPI } from '$lib/api';
import type { User } from '$lib/api/types';

/**
 * Authentication hook to handle JWT token validation
 * and user session management
 */
const auth: Handle = async ({ event, resolve }) => {
  // Get the JWT token from cookies
  const token = event.cookies.get('jwt');

  // Set default authenticated state
  event.locals.authenticated = false;
  event.locals.token = undefined;
  event.locals.user = undefined;

  // If token exists, validate it and get the user
  if (token) {
    try {
      // Verify token and get user data
      const userData = await authAPI.getCurrentUser(token);
      
      if (userData && userData.data) {
        const strapiUser: User = userData.data;
        
        // Map Strapi user to app user format
        event.locals.user = {
          id: String(strapiUser.id),
          name: strapiUser.username, // Map username to name
          email: strapiUser.email,
          username: strapiUser.username,
          confirmed: strapiUser.confirmed,
          blocked: strapiUser.blocked,
          role: strapiUser.role
        };
        
        event.locals.authenticated = true;
        event.locals.token = token;
      }
    } catch (error) {
      // If token is invalid, clear it
      console.error('Authentication error:', error);
      event.cookies.delete('jwt', { path: '/' });
    }
  }

  // Continue with the request
  return resolve(event);
};

/**
 * CORS headers for API endpoints
 */
const cors: Handle = async ({ event, resolve }) => {
  // Check if the request is to the API
  if (event.url.pathname.startsWith('/api')) {
    // Handle preflight requests
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // Get the response
    const response = await resolve(event);
    
    // Add CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }
  
  return resolve(event);
};

// Combine hooks using sequence
export const handle = sequence(auth, cors);