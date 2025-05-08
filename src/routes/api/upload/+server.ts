import { json, error } from '@sveltejs/kit';
import { fileAPI } from '$lib/api';
import type { RequestEvent } from '@sveltejs/kit';

// POST /api/upload - Upload files
export async function POST({ request, cookies }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Check if user is authenticated
    if (!token) {
      throw error(401, 'Authentication required');
    }

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw error(400, 'Multipart form data is required');
    }

    try {
      // Parse form data
      const formData = await request.formData();
      
      // Get files from form data
      const files = formData.getAll('files');
      
      if (!files.length) {
        throw error(400, 'No files provided');
      }
      
      // Ensure all items are files
      if (!files.every(file => file instanceof File)) {
        throw error(400, 'Invalid files in request');
      }
      
      // Extract additional fields
      const refId = formData.get('refId')?.toString();
      const ref = formData.get('ref')?.toString();
      const field = formData.get('field')?.toString();
      const path = formData.get('path')?.toString();
      
      // Call API to upload files
      const response = await fileAPI.upload(files as File[], {
        refId,
        ref,
        field,
        path,
        token
      });
      
      return json(response);
    } catch (err: any) {
      console.error('Error parsing form data:', err);
      throw error(400, 'Invalid form data');
    }
  } catch (err: any) {
    console.error('Error uploading file:', err);
    throw error(err.status || 500, err.message || 'Failed to upload file');
  }
}

// GET /api/upload/files - Get all uploaded files
export async function GET({ cookies, url }: RequestEvent) {
  try {
    // Get JWT token from cookies
    const token = cookies.get('jwt');
    
    // Get file ID from query params
    const fileId = url.searchParams.get('id');
    
    if (fileId) {
      // Get a specific file
      const response = await fileAPI.getInfo(fileId, token || undefined);
      return json(response);
    } else {
      // Get all files
      const response = await fileAPI.listFiles(token || undefined);
      return json(response);
    }
  } catch (err: any) {
    console.error('Error fetching files:', err);
    throw error(err.status || 500, err.message || 'Failed to fetch files');
  }
}