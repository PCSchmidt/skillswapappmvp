# SkillSwap API Documentation

This document provides comprehensive details on the SkillSwap MVP API endpoints, authentication requirements, and usage guidelines for both internal and external developers.

## Base URL

- **Production**: `https://skillswap.app/api`
- **Staging**: `https://staging.skillswap.app/api`
- **Development**: `http://localhost:3000/api`

## Authentication

Most API endpoints require authentication. SkillSwap uses Supabase JWT tokens for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

You can obtain a token through the `/auth` endpoints described below.

## Core API Endpoints

### Health Check

Endpoint for monitoring services to check if the API and database are functioning correctly.

- **URL**: `/health`
- **Method**: `GET`
- **Authentication Required**: No
- **Rate Limit**: 60 requests per minute

**Response Example**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-05-04T14:30:00.000Z",
  "environment": "production",
  "services": {
    "api": {
      "status": "healthy",
      "responseTime": "45ms"
    },
    "database": {
      "status": "healthy",
      "responseTime": "120ms",
      "error": null
    }
  },
  "uptime": 3600
}
```

**Status Codes**:
- `200 OK`: System is fully operational
- `503 Service Unavailable`: One or more system components are unavailable

### Robots.txt

Dynamically generates a robots.txt file based on the environment.

- **URL**: `/robots`
- **Method**: `GET`
- **Authentication Required**: No
- **Cache Duration**: 1 hour

**Response Example**:
```
# SkillSwap Production Environment
# Allow all search engines to index the site
User-agent: *
Allow: /

# Disallow specific areas
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /profile/*/edit
Disallow: /inbox/
Disallow: /settings/

# Sitemap
Sitemap: https://skillswap.app/sitemap.xml
```

**Notes**:
- Non-production environments return a robots.txt that disallows all crawling
- Production environment allows crawling with restrictions on private/sensitive routes

### Sitemap.xml

Dynamically generates a sitemap.xml file for search engine indexing.

- **URL**: `/sitemap`
- **Method**: `GET`
- **Authentication Required**: No
- **Cache Duration**: 1 hour

**Response Example**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://skillswap.app/</loc>
    <lastmod>2025-05-04T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs... -->
</urlset>
```

**Notes**:
- In production, includes both static pages and dynamic content pages (skills, profiles)
- In non-production environments, includes only static pages
- Dynamic content is pulled from the database (up to 1000 entries per content type)

## Protected Route Structure

The following routes require authentication. Attempting to access them without authentication will result in a redirect to the login page.

- `/dashboard/*` - User dashboard and related functionality
- `/profile/*` - User profile management (except public profile viewing)
- `/skills/new` - Creation of new skills
- `/skills/edit/*` - Editing existing skills
- `/trades/*` - Trading management system
- `/messages/*` - Messaging system
- `/auth/complete-profile` - Profile completion flow after initial signup

## Authentication Endpoints

The following authentication-related endpoints are available:

- `/login` - Log in with email/password
- `/signup` - Create a new account
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password with token
- `/auth/verify` - Verify email with token

## Maintenance Mode

When the application is in maintenance mode:

- All regular routes redirect to `/maintenance`
- API endpoints return a 503 status code with a JSON message and a Retry-After header
- Only specific routes remain accessible:
  - `/maintenance`
  - `/api/health`
  - `/api/robots`
  - `/api/sitemap`
  - Static resource paths

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    // Additional error information (optional)
  }
}
```

Common status codes:
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized for this resource
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error
- `503 Service Unavailable`: Service temporarily unavailable (often during maintenance)

## Rate Limiting

API requests are subject to rate limiting to ensure fair usage and system stability:

- Authenticated users: 120 requests per minute
- Unauthenticated users: 60 requests per minute
- Health check endpoint: 60 requests per minute

When a rate limit is exceeded, the API returns a 429 status code with a Retry-After header.

## Additional Resources

- [Development Documentation](./development.md)
- [Database Schema](./database_schema.md)
- [Authentication Guide](./authentication_guide.md)
