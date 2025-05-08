import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { authClient, type User, type LoginRequest, type RegisterRequest } from '$lib/api/auth';

// Authentication state
let user = $state<User | null>(null);
let token = $state<string | null>(null);
let authError = $state<string | null>(null);
let loading = $state(false);

// Create a derived value for isLoading to avoid direct assignment
const isLoading = $derived(loading);

// Aliases for compatibility with existing code
const currentUser = user;
const authToken = token;

// Initialize the auth state from localStorage if available
if (browser) {
  // Try to get the token from localStorage
  const storedToken = localStorage.getItem('auth_token');
  if (storedToken) {
    token = storedToken;
    // Try to fetch the current user
    loadUser().catch(() => {
      // If loading the user fails, clear the token
      token = null;
      localStorage.removeItem('auth_token');
    });
  }
}

/**
 * Set the loading state
 */
function setLoading(value: boolean): void {
  loading = value;
}

/**
 * Set the auth error
 */
function setAuthError(error: string | null): void {
  authError = error;
}

/**
 * Load the current user from the API
 */
async function loadUser(): Promise<User> {
  try {
    setLoading(true);
    setAuthError(null);
    const currentUser = await authClient.getCurrentUser();
    user = currentUser;
    return currentUser;
  } catch (error) {
    setAuthError(error instanceof Error ? error.message : 'Failed to load user');
    throw error;
  } finally {
    setLoading(false);
  }
}

/**
 * Login a user with email/password
 */
async function login(credentials: { email: string; password: string }): Promise<User> {
  try {
    setLoading(true);
    setAuthError(null);
    
    // Convert to the expected LoginRequest format
    const loginRequest: LoginRequest = {
      identifier: credentials.email,
      password: credentials.password
    };
    
    const response = await authClient.login(loginRequest);
    token = response.jwt;
    
    // Store the token in localStorage
    if (browser) {
      localStorage.setItem('auth_token', response.jwt);
    }
    
    user = response.user;
    
    return user;
  } catch (error) {
    setAuthError(error instanceof Error ? error.message : 'Login failed');
    throw error;
  } finally {
    setLoading(false);
  }
}

/**
 * Register a new user
 */
async function register(userData: RegisterRequest): Promise<User> {
  try {
    setLoading(true);
    setAuthError(null);
    
    const response = await authClient.register(userData);
    token = response.jwt;
    
    // Store the token in localStorage
    if (browser) {
      localStorage.setItem('auth_token', response.jwt);
    }
    
    user = response.user;
    
    return user;
  } catch (error) {
    setAuthError(error instanceof Error ? error.message : 'Registration failed');
    throw error;
  } finally {
    setLoading(false);
  }
}

/**
 * Logout the current user
 */
function logout(redirectTo = '/login'): void {
  authClient.logout();
  user = null;
  token = null;
  
  // Remove the token from localStorage
  if (browser) {
    localStorage.removeItem('auth_token');
  }
  
  if (browser && redirectTo) {
    goto(redirectTo);
  }
}

/**
 * Check if the user is authenticated
 */
function isAuthenticated(): boolean {
  return !!user && !!token;
}

/**
 * Get the current authentication token
 */
function getToken(): string | null {
  return token;
}

/**
 * Get the current user
 */
function getUser(): User | null {
  return user;
}

/**
 * Require authentication for a route
 * Redirects to login if not authenticated
 */
function requireAuth(redirectTo = '/login'): void {
  if (browser && !isAuthenticated()) {
    goto(redirectTo);
  }
}

/**
 * Alias for loadUser to match existing code
 */
const fetchCurrentUser = loadUser;

// Export the auth store functions and state
export {
  user,
  token,
  currentUser,
  authToken,
  authError,
  isLoading,
  setLoading,
  setAuthError,
  login,
  logout,
  register,
  loadUser,
  fetchCurrentUser,
  isAuthenticated,
  getToken,
  getUser,
  requireAuth
};