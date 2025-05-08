


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
