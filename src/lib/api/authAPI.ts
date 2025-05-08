import { strapiClient } from './strapiClient';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UserResponse
} from './types';

/**
 * Authentication API functions
 */
export const authAPI = {
  /**
   * Log in a user with email/username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return strapiClient.post<AuthResponse>('/auth/local', credentials);
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    return strapiClient.post<AuthResponse>('/auth/local/register', userData);
  },

  /**
   * Request a password reset email
   */
  async forgotPassword(data: ForgotPasswordPayload): Promise<{ ok: boolean }> {
    return strapiClient.post<{ ok: boolean }>('/auth/forgot-password', data);
  },

  /**
   * Reset a password using the token from the reset email
   */
  async resetPassword(data: ResetPasswordPayload): Promise<AuthResponse> {
    return strapiClient.post<AuthResponse>('/auth/reset-password', data);
  },

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(token: string): Promise<UserResponse> {
    return strapiClient.get<UserResponse>('/users/me', { token });
  }
};