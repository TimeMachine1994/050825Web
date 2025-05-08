import { error } from '@sveltejs/kit';
import type { StrapiErrorResponse, StrapiQueryParams, StrapiResponse } from './types';

// Re-export types that other files are expecting
export type { StrapiResponse, StrapiQueryParams };

const API_URL = 'https://api.tributestream.com/api';

// Store auth token in memory (will be lost on page refresh)
let authToken: string | null = null;

/**
 * Set the authentication token
 */
export function setToken(token: string): void {
  authToken = token;
}

/**
 * Remove the authentication token
 */
export function removeToken(): void {
  authToken = null;
}

/**
 * Base options for fetch requests
 */
interface FetchOptions extends RequestInit {
  token?: string | null;
  params?: StrapiQueryParams | Record<string, any>;
}

/**
 * Build query string from parameters
 */
function buildQueryParams(params?: StrapiQueryParams | Record<string, any>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  
  // Process each key in the params object
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like pagination, filters, etc.
      searchParams.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach(item => searchParams.append(`${key}[]`, item.toString()));
    } else {
      // Handle primitive values
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Main API client for interacting with Strapi
 */
export const strapiClient = {
  /**
   * Performs a fetch request to the Strapi API
   */
  async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { token = authToken, params, ...fetchOptions } = options;
    
    // Build the URL with query parameters
    const url = `${API_URL}${endpoint}${buildQueryParams(params)}`;
    
    // Set up headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {})
    };

    // Add authorization token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Parse response
      const contentType = response.headers.get('Content-Type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      // Handle API errors
      if (!response.ok) {
        const errorData = data as StrapiErrorResponse;
        const status = errorData.error?.status || response.status;
        const message = errorData.error?.message || 'An unknown error occurred';
        
        throw error(status, message);
      }

      return data as T;
    } catch (err) {
      // Re-throw SvelteKit errors
      if (err instanceof Error && 'status' in err) {
        throw err;
      }
        
      // Handle network errors
      throw error(500, 'Failed to connect to API');
    }
  },
  
  /**
   * Perform a GET request
   */
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  },
  
  /**
   * Perform a POST request
   */
  async post<T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  
  /**
   * Perform a PUT request
   */
  async put<T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  
  /**
   * Perform a DELETE request
   */
  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};

// Legacy function aliases with compatible signatures
export async function apiRequest<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  return strapiClient.fetch<T>(endpoint, options);
}

/**
 * GET request with legacy signature
 */
export async function getData<T>(
  endpoint: string, 
  token?: string | null, 
  params?: StrapiQueryParams | Record<string, any>
): Promise<T> {
  return strapiClient.get<T>(endpoint, { token, params });
}

/**
 * POST request with legacy signature
 */
export async function postData<T>(
  endpoint: string, 
  body: any, 
  token?: string | null
): Promise<T> {
  return strapiClient.post<T>(endpoint, body, { token });
}

/**
 * PUT request with legacy signature
 */
export async function updateData<T>(
  endpoint: string, 
  body: any, 
  token?: string | null
): Promise<T> {
  return strapiClient.put<T>(endpoint, body, { token });
}

/**
 * DELETE request with legacy signature
 */
export async function deleteData<T>(
  endpoint: string, 
  token?: string | null
): Promise<T> {
  return strapiClient.delete<T>(endpoint, { token });
}