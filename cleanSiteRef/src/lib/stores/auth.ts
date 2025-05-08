import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { authClient, type User, type LoginRequest, type RegisterRequest, type AuthResponse } from '$lib/api/auth';

// Define the authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Create the auth store
let authState = $state<AuthState>({
  user: null,
  token: null,
  loading: false,
  error: null
});

// Initialize the store
function initializeStore() {
  if (!browser) return;
  
  // Load token from localStorage
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    authState.token = token;
    // Try to fetch the user data
    fetchCurrentUser().catch(() => {
      // If fetching fails, clear the token
      clearAuth();
    });
  }
}

// Initialize the store when this module is imported
initializeStore();

// Authentication actions
async function login(credentials: LoginRequest): Promise<User> {
  try {
    authState.loading = true;
    authState.error = null;
    
    const response = await authClient.login(credentials);
    
    // Update the store with the user and token
    setAuth(response);
    
    return response.user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    authState.error = message;
    throw err;
  } finally {
    authState.loading = false;
  }
}

async function register(data: RegisterRequest): Promise<User> {
  try {
    authState.loading = true;
    authState.error = null;
    
    const response = await authClient.register(data);
    
    // Update the store with the user and token
    setAuth(response);
    
    return response.user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    authState.error = message;
    throw err;
  } finally {
    authState.loading = false;
  }
}

async function logout(redirectTo = '/login'): Promise<void> {
  authClient.logout();
  clearAuth();
  
  if (redirectTo) {
    await goto(redirectTo);
  }
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    authState.loading = true;
    authState.error = null;
    
    const user = await authClient.getCurrentUser();
    authState.user = user;
    
    return user;
  } catch (err) {
    authState.error = 'Failed to fetch user data';
    authState.user = null;
    return null;
  } finally {
    authState.loading = false;
  }
}

// Helper functions
function setAuth(response: AuthResponse): void {
  authState.user = response.user;
  authState.token = response.jwt;
  
  if (browser) {
    localStorage.setItem('auth_token', response.jwt);
  }
}

function clearAuth(): void {
  authState.user = null;
  authState.token = null;
  
  if (browser) {
    localStorage.removeItem('auth_token');
  }
}

// Derived state
const isAuthenticated = $derived(!!authState.token && !!authState.user);
const currentUser = $derived(authState.user);
const authToken = $derived(authState.token);
const isLoading = $derived(authState.loading);
const authError = $derived(authState.error);

// Authentication guard function
function requireAuth(redirectTo = '/login'): User | null {
  if (!isAuthenticated) {
    if (browser) {
      goto(redirectTo);
    }
    return null;
  }
  
  return authState.user;
}

// Export the store and actions
export {
  // State
  authState,
  isAuthenticated,
  currentUser,
  authToken,
  isLoading,
  authError,
  
  // Actions
  login,
  logout,
  register,
  fetchCurrentUser,
  
  // Guards
  requireAuth
};