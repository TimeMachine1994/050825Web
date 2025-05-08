import { json, error } from '@sveltejs/kit';
import { funeralHomeAPI } from '$lib/api';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/funeral-homes - Get all funeral homes with optional filtering
export async function GET({ url, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');

    // Parse query parameters
    const queryParams: Record<string, any> = {};

    // Handle pagination
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');
    if (page || pageSize) {
      queryParams.pagination = {};
      if (page) queryParams.pagination.page = parseInt(page);
      if (pageSize) queryParams.pagination.pageSize = parseInt(pageSize);
    }

    // Handle filters
    const searchEntries = Array.from(url.searchParams.entries());
    const filterEntries = searchEntries.filter(([key]) => key.startsWith('filters['));
    
    // Build filters object
    if (filterEntries.length > 0) {
      queryParams.filters = {};
      
      filterEntries.forEach(([key, value]) => {
        // Extract filter field and operator
        const match = key.match(/filters\[(.*?)\](?:\[(.*?)\])?$/);
        if (match) {
          const field = match[1];
          const operator = match[2];
          
          if (operator) {
            // Handle operators like $eq, $contains, etc.
            if (!queryParams.filters[field]) queryParams.filters[field] = {};
            queryParams.filters[field][operator] = value;
          } else {
            // Simple equality filter
            queryParams.filters[field] = value;
          }
        }
      });
    }

    // Handle sorting
    const sort = url.searchParams.get('sort');
    if (sort) queryParams.sort = sort.split(',');

    // Handle field selection
    const fields = url.searchParams.get('fields');
    if (fields) queryParams.fields = fields.split(',');

    // Handle population
    const populate = url.searchParams.get('populate');
    if (populate) queryParams.populate = populate.split(',');

    // Call API with built query params
    const response = await funeralHomeAPI.list(token || undefined, queryParams);
    
    return json(response);
  } catch (err: any) {
    console.error('Error fetching funeral homes:', err);
    throw error(err.status || 500, err.message || 'Failed to fetch funeral homes');
  }
}

// POST /api/funeral-homes - Create a new funeral home
export async function POST({ request, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }

    // Parse request body
    const body = await request.json();

    // Call API to create funeral home
    const response = await funeralHomeAPI.create({ data: body }, token);
    
    return json(response);
  } catch (err: any) {
    console.error('Error creating funeral home:', err);
    throw error(err.status || 500, err.message || 'Failed to create funeral home');
  }
}