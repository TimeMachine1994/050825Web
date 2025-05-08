import { redirect } from '@sveltejs/kit';
import { authClient } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  // If user is already logged in, redirect to dashboard
  if (authClient.isAuthenticated()) {
    throw redirect(303, '/dashboard');
  }

  return {
    // Pass any query parameters to the page
    redirectTo: url.searchParams.get('redirectTo') || '/dashboard'
  };
};