import { strapiClient } from './strapiClient';
import type { 
  Tribute,
  TributeAttributes,
  TributesResponse,
  TributeResponse,
  StrapiQueryParams
} from './types';

const ENDPOINT = '/tributes';

/**
 * Tributes API functions
 */
export const tributeAPI = {
  /**
   * Get a list of tributes with optional filtering, sorting, and pagination
   */
  async list(token?: string, params?: StrapiQueryParams): Promise<TributesResponse> {
    return strapiClient.get<TributesResponse>(ENDPOINT, { token, params });
  },

  /**
   * Get a single tribute by ID
   */
  async getById(id: number | string, token?: string, params?: StrapiQueryParams): Promise<TributeResponse> {
    return strapiClient.get<TributeResponse>(`${ENDPOINT}/${id}`, { token, params });
  },

  /**
   * Create a new tribute
   */
  async create(data: { data: TributeAttributes }, token: string): Promise<TributeResponse> {
    return strapiClient.post<TributeResponse>(ENDPOINT, data, { token });
  },

  /**
   * Update an existing tribute
   */
  async update(id: number | string, data: { data: Partial<TributeAttributes> }, token: string): Promise<TributeResponse> {
    return strapiClient.put<TributeResponse>(`${ENDPOINT}/${id}`, data, { token });
  },

  /**
   * Delete a tribute
   */
  async delete(id: number | string, token: string): Promise<TributeResponse> {
    return strapiClient.delete<TributeResponse>(`${ENDPOINT}/${id}`, { token });
  }
};

/**
 * Legacy functions for compatibility with existing code
 */
export async function getTributes(token?: string, params?: StrapiQueryParams): Promise<TributesResponse> {
  return tributeAPI.list(token, params);
}

export async function getTribute(id: number | string, token?: string, params?: StrapiQueryParams): Promise<TributeResponse> {
  return tributeAPI.getById(id, token, params);
}

export async function createTribute(data: { data: TributeAttributes }, token: string): Promise<TributeResponse> {
  return tributeAPI.create(data, token);
}

export async function updateTribute(id: number | string, data: { data: Partial<TributeAttributes> }, token: string): Promise<TributeResponse> {
  return tributeAPI.update(id, data, token);
}

export async function deleteTribute(id: number | string, token: string): Promise<TributeResponse> {
  return tributeAPI.delete(id, token);
}