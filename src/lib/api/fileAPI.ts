import { strapiClient } from './strapiClient';
import type {
  FileInfo,
  FileInfoResponse,
  FilesInfoResponse
} from './types';

const ENDPOINT = '/upload';

/**
 * File Upload API functions
 */
export const fileAPI = {
  /**
   * Upload one or more files
   * 
   * @param files - The file(s) to upload
   * @param refId - Optional ID of the entry to link files to
   * @param ref - Optional name of the model to link files to
   * @param field - Optional field of the entry to link files to
   * @param path - Optional storage folder path
   * @param token - JWT authentication token
   * @returns Information about the uploaded file(s)
   */
  async upload(
    files: File | File[],
    options: {
      refId?: string | number;
      ref?: string;
      field?: string;
      path?: string;
      token: string;
    }
  ): Promise<FilesInfoResponse> {
    const { token, ...rest } = options;
    
    // Create FormData
    const formData = new FormData();
    
    // Append files
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', files);
    }
    
    // Append other fields
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Use strapiClient with custom fetch options for FormData
    return strapiClient.fetch<FilesInfoResponse>(ENDPOINT, {
      method: 'POST',
      body: formData,
      token,
      headers: {
        // Don't set Content-Type here, the browser will set it with the boundary parameter
      },
    });
  },

  /**
   * Get information about a single file
   */
  async getInfo(id: number | string, token?: string): Promise<FileInfoResponse> {
    return strapiClient.get<FileInfoResponse>(`${ENDPOINT}/files/${id}`, { token });
  },

  /**
   * Get information about all files
   */
  async listFiles(token?: string): Promise<FilesInfoResponse> {
    return strapiClient.get<FilesInfoResponse>(`${ENDPOINT}/files`, { token });
  },

  /**
   * Delete a file
   */
  async delete(id: number | string, token: string): Promise<FileInfoResponse> {
    return strapiClient.delete<FileInfoResponse>(`${ENDPOINT}/files/${id}`, { token });
  }
};

/**
 * Legacy functions for compatibility with existing code
 */
export async function uploadFile(
  files: File | File[],
  options: {
    refId?: string | number;
    ref?: string;
    field?: string;
    path?: string;
    token: string;
  }
): Promise<FilesInfoResponse> {
  return fileAPI.upload(files, options);
}

export async function getFileInfo(id: number | string, token?: string): Promise<FileInfoResponse> {
  return fileAPI.getInfo(id, token);
}

export async function deleteFile(id: number | string, token: string): Promise<FileInfoResponse> {
  return fileAPI.delete(id, token);
}