/**
 * Common Strapi response structure
 */
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    [key: string]: any;
  };
}

/**
 * Common Strapi error response structure
 */
export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Strapi query parameters
 */
export interface StrapiQueryParams {
  pagination?: {
    page?: number;
    pageSize?: number;
    withCount?: boolean;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  fields?: string[];
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
}

/**
 * Funeral Home attributes (for create/update operations)
 */
export interface FuneralHomeAttributes {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  directors?: number[] | { id: number }[];
}

/**
 * Funeral Home interface
 */
export interface FuneralHome {
  id: number;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  directors?: Director[];
}

// Array of funeral homes
export type FuneralHomes = FuneralHome[];

// Response containing funeral homes
export type FuneralHomesResponse = StrapiResponse<FuneralHome[]>;
export type FuneralHomeResponse = StrapiResponse<FuneralHome>;

/**
 * Director interface
 */
export interface Director {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

/**
 * Tribute attributes (for create/update operations)
 */
export interface TributeAttributes {
  name: string;
  slug: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  owner?: number | { id: number };
}

/**
 * Tribute interface
 */
export interface Tribute {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  owner?: User;
}

// Array of tributes
export type Tributes = Tribute[];

// Response containing tributes
export type TributesResponse = StrapiResponse<Tribute[]>;
export type TributeResponse = StrapiResponse<Tribute>;

/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role;
}

// User response
export type UserResponse = StrapiResponse<User>;

/**
 * Role interface
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  type?: string;
}

/**
 * Auth related interfaces
 */
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

/**
 * File related interfaces
 */
export interface FileInfo {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  data?: any; // Added for compatibility with existing code
}

export type FileInfoResponse = StrapiResponse<FileInfo>;
export type FilesInfoResponse = StrapiResponse<FileInfo[]>;