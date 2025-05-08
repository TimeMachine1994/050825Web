/**
 * Base API client for making HTTP requests
 * Provides utilities for authenticated and non-authenticated requests
 */

import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

// Use a default API URL if the environment variable is not available
const API_URL = 'http://localhost:1337/api';

/**
 * API response error type
 */
export interface ApiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Base API response type
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

/**
 * Request options type extending the standard fetch options
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  withAuth?: boolean;
}

/**
 * Base API client class
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the stored authentication token
   */
  private getAuthToken(): string | null {
    if (!browser) return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Build the full URL including query parameters
   */
  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, withAuth = false, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    
    // Set default headers
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');
    
    // Add authorization header if required
    if (withAuth) {
      const token = this.getAuthToken();
      if (!token) {
        throw error(401, 'Authentication required');
      }
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers
      });
      
      // Parse the response
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        return {
          error: {
            status: response.status,
            name: data.error?.name || 'ApiError',
            message: data.error?.message || 'An unknown error occurred',
            details: data.error?.details
          }
        };
      }
      
      return { data };
    } catch (err) {
      console.error('API request failed:', err);
      return {
        error: {
          status: 500,
          name: 'NetworkError',
          message: 'Failed to connect to the API'
        }
      };
    }
  }

  /**
   * Make a GET request
   */
  async get<T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    path: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    path: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'DELETE'
    });
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();