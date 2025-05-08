import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { isAuthenticated, getUser, loadUser } from '$lib/stores/auth.svelte';

/**
 * Hook to load the current user on component mount
 * @param options Configuration options
 * @returns The current authentication state
 */
export function useAuth(options: { loadUser?: boolean } = {}) {
  const { loadUser: shouldLoadUser = true } = options;
  
  if (browser && shouldLoadUser) {
    onMount(() => {
      if (isAuthenticated() && !getUser()) {
        loadUser();
      }
    });
  }
  
  return {
    isAuthenticated: isAuthenticated(),
    currentUser: getUser()
  };
}