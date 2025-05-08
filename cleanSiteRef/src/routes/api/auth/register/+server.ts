import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authClient } from '$lib/api/auth';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Call the auth client to register the user
    const result = await authClient.register(data);
    
    // Return the result as JSON
    return json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // Handle errors
    const message = error instanceof Error ? error.message : 'Unknown error during registration';
    return json({ error: message }, { status: 400 });
  }
};