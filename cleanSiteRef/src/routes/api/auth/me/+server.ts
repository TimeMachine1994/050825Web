import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authClient } from '$lib/api/auth';

export const GET: RequestHandler = async ({ request }) => {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, 'Authentication required');
    }
    
    // Call the auth client to get the current user
    const user = await authClient.getCurrentUser();
    
    // Return the user data as JSON
    return json(user, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    // Handle errors
    if (err instanceof Error) {
      return json({ error: err.message }, { 
        status: err.message.includes('Authentication required') ? 401 : 400 
      });
    }
    
    return json({ error: 'Unknown error fetching user data' }, { status: 500 });
  }
};