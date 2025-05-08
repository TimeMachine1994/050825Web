import { strapiClient } from './strapiClient';
import type {
  FuneralHome,
  FuneralHomeAttributes,
  FuneralHomesResponse,
  FuneralHomeResponse,
  StrapiQueryParams
} from './types';

const ENDPOINT = '/funeral-homes';

/**
 * Funeral Homes API functions
 */
export const funeralHomeAPI = {
  /**
   * Get a list of funeral homes with optional filtering, sorting, and pagination
   */
  async list(token?: string, params?: StrapiQueryParams): Promise<FuneralHomesResponse> {
    return strapiClient.get<FuneralHomesResponse>(ENDPOINT, { token, params });
  },

  /**
   * Get a single funeral home by ID
   */
  async getById(id: number | string, token?: string, params?: StrapiQueryParams): Promise<FuneralHomeResponse> {
    return strapiClient.get<FuneralHomeResponse>(`${ENDPOINT}/${id}`, { token, params });
  },

  /**
   * Create a new funeral home
   */
  async create(data: { data: FuneralHomeAttributes }, token: string): Promise<FuneralHomeResponse> {
    return strapiClient.post<FuneralHomeResponse>(ENDPOINT, data, { token });
  },

  /**
   * Update an existing funeral home
   */
  async update(id: number | string, data: { data: Partial<FuneralHomeAttributes> }, token: string): Promise<FuneralHomeResponse> {
    return strapiClient.put<FuneralHomeResponse>(`${ENDPOINT}/${id}`, data, { token });
  },

  /**
   * Delete a funeral home
   */
  async delete(id: number | string, token: string): Promise<FuneralHomeResponse> {
    return strapiClient.delete<FuneralHomeResponse>(`${ENDPOINT}/${id}`, { token });
  }
};

/**
 * Legacy functions for compatibility with existing code
 */
export async function getFuneralHomes(token?: string, params?: StrapiQueryParams): Promise<FuneralHomesResponse> {
  return funeralHomeAPI.list(token, params);
}

export async function getFuneralHome(id: number | string, token?: string, params?: StrapiQueryParams): Promise<FuneralHomeResponse> {
  return funeralHomeAPI.getById(id, token, params);
}

export async function createFuneralHome(data: { data: FuneralHomeAttributes }, token: string): Promise<FuneralHomeResponse> {
  return funeralHomeAPI.create(data, token);
}

export async function updateFuneralHome(id: number | string, data: { data: Partial<FuneralHomeAttributes> }, token: string): Promise<FuneralHomeResponse> {
  return funeralHomeAPI.update(id, data, token);
}

export async function deleteFuneralHome(id: number | string, token: string): Promise<FuneralHomeResponse> {
  return funeralHomeAPI.delete(id, token);
}