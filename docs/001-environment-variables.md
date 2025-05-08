# Environment Variables in SvelteKit Application

This document explains how environment variables are used in this SvelteKit application.

## Types of Environment Variables

SvelteKit supports two types of environment variables:

1. **Public Environment Variables**: Accessible on both client and server
2. **Private Environment Variables**: Only accessible on the server

## Public Environment Variables

Public environment variables must be prefixed with `PUBLIC_` and can be accessed in both client and server code.

### Current Public Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PUBLIC_STRAPI_URL` | Base URL for the Strapi CMS | `https://miraculous-morning-0acdf6e165.strapiapp.com` |
| `PUBLIC_STRAPI_PORT` | Optional port for the Strapi CMS | None |
| `PUBLIC_AUTH_TOKEN_NAME` | Name of the authentication token cookie | `jwt` |
| `PUBLIC_AUTH_TOKEN_EXPIRY` | Expiration time for the auth token in seconds | `86400` (24 hours) |

### How to Access Public Environment Variables

In server-side code:
```js
import { PUBLIC_STRAPI_URL } from '$env/static/public';

console.log(PUBLIC_STRAPI_URL);
```

In client-side code:
```js
import { PUBLIC_STRAPI_URL } from '$env/static/public';

console.log(PUBLIC_STRAPI_URL);
```

In app.html:
```html
<script>
  window.env = {
    strapiUrl: '%sveltekit.env.PUBLIC_STRAPI_URL%'
  };
</script>
```

## Private Environment Variables

Private environment variables are only accessible in server-side code and are used for sensitive information like API keys and credentials.

### How to Access Private Environment Variables

In server-side code only:
```js
import { API_SECRET_KEY } from '$env/static/private';

console.log(API_SECRET_KEY);
```

## Setting Environment Variables

### Development

Create a `.env` file in the root of your project:

```
PUBLIC_STRAPI_URL=http://localhost
PUBLIC_STRAPI_PORT=1337
PUBLIC_AUTH_TOKEN_NAME=jwt
PUBLIC_AUTH_TOKEN_EXPIRY=86400
API_SECRET_KEY=your_secret_key
```

### Production

Set environment variables according to your hosting platform's documentation.

## Best Practices

1. **Never store sensitive information in public environment variables**
2. **Always use `$env/static/private` for sensitive data**
3. **Use fallback values for optional environment variables**
4. **Keep environment variable names consistent across the application**
5. **Document all environment variables used in the application**

## Files Using Environment Variables

The following files in this application use environment variables:

- `src/routes/api/auth/[...path]/+server.js` - Uses public variables for Strapi connection
- `src/routes/api/users/[...path]/+server.js` - Uses public variables for Strapi connection
- `src/lib/services/auth.js` - Uses public variables for authentication configuration
- `src/hooks.server.js` - Uses public variables for server-side authentication
- `src/app.html` - Makes public variables available to client-side JavaScript