import { json, error } from '@sveltejs/kit';
import { funeralHomeAPI } from '$lib/api';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/funeral-homes/[id] - Get a single funeral home
export async function GET({ params, url, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Get funeral home ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Funeral home ID is required');
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
    const response = await funeralHomeAPI.getById(id, token || undefined, queryParams);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error fetching funeral home ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to fetch funeral home');
  }
}

// PUT /api/funeral-homes/[id] - Update a funeral home
export async function PUT({ params, request, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }
    
    // Get funeral home ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Funeral home ID is required');
    }

    // Parse request body
    const body = await request.json();

    // Call API
    const response = await funeralHomeAPI.update(id, { data: body }, token);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error updating funeral home ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to update funeral home');
  }
}

// DELETE /api/funeral-homes/[id] - Delete a funeral home
export async function DELETE({ params, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }
    
    // Get funeral home ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'Funeral home ID is required');
    }

    // Call API
    const response = await funeralHomeAPI.delete(id, token);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error deleting funeral home ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to delete funeral home');
  }
}