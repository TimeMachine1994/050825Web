import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { fetchCurrentUser, isAuthenticated, currentUser } from '$lib/stores/auth';

/**
 * Hook to load the current user on component mount
 * @param options Configuration options
 * @returns The current authentication state
 */
export function useAuth(options: { loadUser?: boolean } = {}) {
  const { loadUser = true } = options;
  
  if (browser && loadUser) {
    onMount(() => {
      if (isAuthenticated && !currentUser) {
        fetchCurrentUser();
      }
    });
  }
  
  return {
    isAuthenticated,
    currentUser
  };
}