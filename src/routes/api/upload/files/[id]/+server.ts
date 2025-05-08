import { json, error } from '@sveltejs/kit';
import { fileAPI } from '$lib/api';
import type { RequestEvent } from '@sveltejs/kit';

// GET /api/upload/files/[id] - Get file information
export async function GET({ params, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Get file ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'File ID is required');
    }

    // Call API
    const response = await fileAPI.getInfo(id, token || undefined);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error fetching file information for ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to fetch file information');
  }
}

// DELETE /api/upload/files/[id] - Delete a file
export async function DELETE({ params, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }
    
    // Get file ID from params
    const id = params.id;
    
    if (!id) {
      throw error(400, 'File ID is required');
    }

    // Call API
    const response = await fileAPI.delete(id, token);
    
    return json(response);
  } catch (err: any) {
    console.error(`Error deleting file ${params.id}:`, err);
    throw error(err.status || 500, err.message || 'Failed to delete file');
  }
}