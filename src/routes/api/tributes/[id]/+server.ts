import { json, error } from '@sveltejs/kit';
import { tributeAPI } from '$lib/api';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/tributes/[id] - Get a single tribute
export async function GET({ params, url, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Get tribute ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Tribute ID is required');
    }

    // Parse query parameters for population, etc.
    const queryParams: Record<string, any> = {};

    // Handle field selection
    const fields = url.searchParams.get('fields');
    if (fields) queryParams.fields = fields.split(',');

    // Handle population
    const populate = url.searchParams.get('populate');
    if (populate) queryParams.populate = populate.split(',');

    // Call API
    const response = await tributeAPI.getById(id, token || undefined, queryParams);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error fetching tribute ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to fetch tribute');
  }
}

// PUT /api/tributes/[id] - Update a tribute
export async function PUT({ params, request, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }
    
    // Get tribute ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Tribute ID is required');
    }

    // Parse request body
    const body = await request.json();

    // Call API
    const response = await tributeAPI.update(id, { data: body }, token);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error updating tribute ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to update tribute');
  }
}

// DELETE /api/tributes/[id] - Delete a tribute
export async function DELETE({ params, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }
    
    // Get tribute ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Tribute ID is required');
    }

    // Call API
    const response = await tributeAPI.delete(id, token);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error deleting tribute ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to delete tribute');
  }
}