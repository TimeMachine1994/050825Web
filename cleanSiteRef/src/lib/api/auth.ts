/**
 * Authentication API client
 * Provides functions for user authentication and management
 */

import { browser } from '$app/environment';
import { apiClient, type ApiResponse } from './client';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * User type
 */
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response type
 */
export interface AuthResponse {
  jwt: string;
  user: User;
}

/**
 * Login request type
 */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/**
 * Register request type
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Forgot password request type
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request type
 */
export interface ResetPasswordRequest {
  password: string;
  passwordConfirmation: string;
  code: string;
}

/**
 * Authentication client class
 */
export class AuthClient {
  /**
   * Register a new user
   * @param data Registration data
   * @param event Optional request event for server-side usage
   */
  async register(data: RegisterRequest, event?: RequestEvent): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/local/register', data);
    
    if (response.data) {
      // Store the JWT token in browser localStorage
      if (browser) {
        localStorage.setItem('auth_token', response.data.jwt);
      }
      
      // Return the unwrapped data for compatibility with existing code
      return response.data;
    }
    
    // If there's an error, throw it
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    throw new Error('Unknown error during registration');
  }

  /**
   * Login a user
   * @param data Login credentials
   * @param event Optional request event for server-side usage
   */
  async login(data: LoginRequest, event?: RequestEvent): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/local', data);
    
    if (response.data) {
      // Store the JWT token in browser localStorage
      if (browser) {
        localStorage.setItem('auth_token', response.data.jwt);
      }
      
      // Return the unwrapped data for compatibility with existing code
      return response.data;
    }
    
    // If there's an error, throw it
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    throw new Error('Unknown error during login');
  }

  /**
   * Logout the current user
   */
  logout(): void {
    if (browser) {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Send a password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    const response = await apiClient.post('/auth/forgot-password', data);
    
    if (response.data) {
      return response.data;
    }
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    throw new Error('Unknown error during password reset request');
  }

  /**
   * Reset a user's password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/reset-password', data);
    
    if (response.data) {
      // Store the JWT token in browser localStorage
      if (browser) {
        localStorage.setItem('auth_token', response.data.jwt);
      }
      
      return response.data;
    }
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    throw new Error('Unknown error during password reset');
  }

  /**
   * Get the current user
   * @param event Optional request event for server-side usage
   */
  async getCurrentUser(event?: RequestEvent): Promise<User> {
    const response = await apiClient.get<User>('/users/me', { withAuth: true });
    
    if (response.data) {
      return response.data;
    }
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    throw new Error('Unknown error fetching current user');
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    if (!browser) return false;
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    if (!browser) return null;
    return localStorage.getItem('auth_token');
  }
}

// Create and export a default instance
export const authClient = new AuthClient();