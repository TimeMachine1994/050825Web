/**
 * Utility functions for handling Strapi query parameters
 */
import type { StrapiQueryParams } from '../types';

/**
 * Convert URL search params to Strapi query params
 */
export function parseQueryParams(url: URL): StrapiQueryParams {
  const queryParams: StrapiQueryParams = {};

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
          if (!queryParams.filters![field]) queryParams.filters![field] = {};
          queryParams.filters![field][operator] = value;
        } else {
          // Simple equality filter
          queryParams.filters![field] = value;
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

  return queryParams;
}

/**
 * Build FormData from a file upload request
 */
export function buildFileFormData(
  files: File | File[],
  options: {
    refId?: string | number;
    ref?: string;
    field?: string;
    path?: string;
  }
): FormData {
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
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}