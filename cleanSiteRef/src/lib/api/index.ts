/**
 * API client exports
 */

// Export the base client
export { apiClient, type ApiResponse, type ApiError, type RequestOptions } from './client';

// Export the auth client and types
export {
  authClient,
  type User,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest
} from './auth';