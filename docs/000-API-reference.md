# Strapi v55 API Reference Guide

## Introduction

The Strapi v55 API provides a RESTful interface to access and manage Funeral Homes and Tributes data. This API is built on Strapi's content management framework and follows RESTful design principles.

### Base URL

```
https://api.tributestream.com/api
```

### Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header for authenticated requests:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a JWT token, use the authentication endpoints described in the Authentication section below.

## Common Query Parameters

The following query parameters can be used across most endpoints to filter, sort, and paginate results.

### Pagination

Control the number of items returned in list endpoints:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `pagination[page]` | Page number | 0 |
| `pagination[pageSize]` | Number of items per page | 25 |
| `pagination[withCount]` | Return total count | true |
| `pagination[start]` | Alternative: Offset value | 0 |
| `pagination[limit]` | Alternative: Number of items to return | 25 |

Example: `/api/funeral-homes?pagination[page]=1&pagination[pageSize]=10`

### Sorting

Sort results by one or more fields:

```
sort=name:asc
sort=createdAt:desc
```

Multiple sorting criteria can be combined with commas: `sort=name:asc,createdAt:desc`

### Filtering

Filter results using field-specific conditions:

```
filters[name][$eq]=Memorial Gardens
filters[city][$containsi]=springfield
```

Common filter operators:
- `$eq`: Equal to
- `$ne`: Not equal to
- `$lt`: Less than
- `$lte`: Less than or equal
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$in`: Included in an array
- `$notIn`: Not included in an array
- `$contains`: Contains (case-sensitive)
- `$containsi`: Contains (case-insensitive)
- `$startsWith`: Starts with
- `$endsWith`: Ends with

Example: `/api/funeral-homes?filters[state][$eq]=NY`

### Field Selection

Specify which fields to include in the response:

```
fields=name,address,phoneNumber
```

Example: `/api/tributes?fields=name,slug,status`

### Relation Population

Include related records in the response:

```
populate=directors
populate=owner
```

Multiple relations can be populated: `populate=directors,tributes`

Deep population is supported: `populate[directors][populate]=role`

## Endpoints Reference

### Funeral Homes API

#### List Funeral Homes

```
GET /funeral-homes
```

Returns a paginated list of funeral homes.

**Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Memorial Gardens Funeral Home",
      "address": "123 Main Street",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62704",
      "phoneNumber": "217-555-1234",
      "directors": [...]
    },
    // Additional funeral homes
  ],
  "meta": {
    "pagination": {
      "page": 0,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

#### Get a Funeral Home

```
GET /funeral-homes/{id}
```

Returns a single funeral home by ID.

**Response Example:**

```json
{
  "data": {
    "id": 1,
    "name": "Memorial Gardens Funeral Home",
    "address": "123 Main Street",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62704",
    "phoneNumber": "217-555-1234",
    "directors": [...]
  },
  "meta": {}
}
```

#### Create a Funeral Home

```
POST /funeral-homes
```

Creates a new funeral home.

**Request Body Example:**

```json
{
  "data": {
    "name": "New Funeral Home",
    "address": "456 Oak Street",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "phoneNumber": "312-555-6789",
    "directors": [1, 2]
  }
}
```

**Response:** Returns the created funeral home object.

#### Update a Funeral Home

```
PUT /funeral-homes/{id}
```

Updates an existing funeral home.

**Request Body Example:**

```json
{
  "data": {
    "name": "Updated Funeral Home Name",
    "phoneNumber": "312-555-9999"
  }
}
```

**Response:** Returns the updated funeral home object.

#### Delete a Funeral Home

```
DELETE /funeral-homes/{id}
```

Deletes a funeral home.

**Response:** Returns the deleted funeral home ID.

### Tributes API

#### List Tributes

```
GET /tributes
```

Returns a paginated list of tributes.

**Response Example:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Smith Memorial",
      "slug": "john-smith-memorial",
      "description": "In loving memory of John Smith",
      "status": "published",
      "owner": {...}
    },
    // Additional tributes
  ],
  "meta": {
    "pagination": {
      "page": 0,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}
```

#### Get a Tribute

```
GET /tributes/{id}
```

Returns a single tribute by ID.

**Response Example:**

```json
{
  "data": {
    "id": 1,
    "name": "John Smith Memorial",
    "slug": "john-smith-memorial",
    "description": "In loving memory of John Smith",
    "status": "published",
    "owner": {...}
  },
  "meta": {}
}
```

#### Create a Tribute

```
POST /tributes
```

Creates a new tribute.

**Request Body Example:**

```json
{
  "data": {
    "name": "Jane Doe Memorial",
    "slug": "jane-doe-memorial",
    "description": "In loving memory of Jane Doe",
    "status": "draft",
    "owner": 1
  }
}
```

**Response:** Returns the created tribute object.

#### Update a Tribute

```
PUT /tributes/{id}
```

Updates an existing tribute.

**Request Body Example:**

```json
{
  "data": {
    "status": "published",
    "description": "Updated description"
  }
}
```

**Response:** Returns the updated tribute object.

#### Delete a Tribute

```
DELETE /tributes/{id}
```

Deletes a tribute.

**Response:** Returns the deleted tribute ID.

### File Upload API

#### Upload Files

```
POST /upload
```

Uploads one or more files.

Content-Type: multipart/form-data

**Form Parameters:**
- `files`: (Required) The file(s) to upload
- `refId`: (Optional) ID of the entry to link files to
- `ref`: (Optional) Name of the model to link files to
- `field`: (Optional) Field of the entry to link files to
- `path`: (Optional) Storage folder path

**Response:** Returns the uploaded file information.

#### Get File Information

```
GET /upload/files/{id}
```

Returns information about a specific file.

#### Delete File

```
DELETE /upload/files/{id}
```

Deletes a file.

### Authentication API

#### Register

```
POST /auth/local/register
```

Registers a new user.

**Request Body Example:**

```json
{
  "username": "johnsmith",
  "email": "john.smith@example.com",
  "password": "Password123"
}
```

**Response:** Returns user information and JWT token.

#### Login

```
POST /auth/local
```

Authenticates a user.

**Request Body Example:**

```json
{
  "identifier": "john.smith@example.com",
  "password": "Password123"
}
```

**Response:** Returns user information and JWT token.

#### Forgot Password

```
POST /auth/forgot-password
```

Sends a password reset email.

**Request Body Example:**

```json
{
  "email": "john.smith@example.com"
}
```

#### Reset Password

```
POST /auth/reset-password
```

Resets a user's password using the token from the reset email.

**Request Body Example:**

```json
{
  "password": "NewPassword123",
  "passwordConfirmation": "NewPassword123",
  "code": "reset_token_from_email"
}
```

#### Get Current User

```
GET /users/me
```

Returns information about the currently authenticated user.

## Key Data Models

### Funeral Home

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| name | String | Name of the funeral home | Yes |
| address | String | Street address | Yes |
| city | String | City | No |
| state | String | State/province | No |
| zipCode | String | Postal/ZIP code | No |
| phoneNumber | String | Contact phone number | No |
| directors | Relation (One-to-Many) | Funeral directors associated with this home | No |

### Tribute

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| name | String | Name of the tribute | Yes |
| slug | String | URL-friendly identifier | Yes |
| description | Text | Tribute description | No |
| status | Enumeration | Status: draft, published, or archived | No |
| owner | Relation (Many-to-One) | User who owns this tribute | No |

### User

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| username | String | Unique username | Yes |
| email | Email | Email address | Yes |
| password | Password | Encrypted password | Yes |
| confirmed | Boolean | Email confirmation status | No |
| blocked | Boolean | Account blocked status | No |
| role | Relation | User role | No |

## Response Format

### Success Response Structure

```json
{
  "data": {
    // Data object or array
  },
  "meta": {
    // Pagination information or additional metadata
  }
}
```

### Error Response Structure

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Error message goes here",
    "details": {
      // Additional error details
    }
  }
}
```

Common HTTP status codes:
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error