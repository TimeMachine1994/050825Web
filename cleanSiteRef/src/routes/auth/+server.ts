import { json } from '@sveltejs/kit';
import { authClient } from '$lib/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const data = await event.request.json();
  const { action } = data;

  try {
    switch (action) {
      case 'login':
        const { identifier, password } = data;
        const loginResponse = await authClient.login({ identifier, password }, event);
        
        // Set the JWT token in a cookie
        event.cookies.set('jwt', loginResponse.jwt, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 // 1 day
        });
        
        return json({ user: loginResponse.user });
        
      case 'register':
        const { username, email, password: registerPassword } = data;
        const registerResponse = await authClient.register(
          { username, email, password: registerPassword },
          event
        );
        
        // Set the JWT token in a cookie
        event.cookies.set('jwt', registerResponse.jwt, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 // 1 day
        });
        
        return json({ user: registerResponse.user });
        
      case 'logout':
        event.cookies.delete('jwt', { path: '/' });
        return json({ success: true });
        
      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return json(
      { error: error.message || 'Authentication failed' },
      { status: error.status || 500 }
    );
  }
};

export const GET: RequestHandler = async (event) => {
  try {
    // Get the current user
    const user = await authClient.getCurrentUser(event);
    return json({ user });
  } catch (error: any) {
    // If the token is invalid, clear it
    if (error.status === 401) {
      event.cookies.delete('jwt', { path: '/' });
    }
    
    return json(
      { error: error.message || 'Failed to get user' },
      { status: error.status || 500 }
    );
  }
};