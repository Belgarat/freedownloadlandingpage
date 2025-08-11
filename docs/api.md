# API Reference

Complete API documentation for Book Landing Stack. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints are public, but admin endpoints require authentication:

```bash
# Login to get session cookie
POST /api/admin/auth
{
  "password": "admin123"
}

# Use the returned session cookie for subsequent requests
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error description",
  "status": 400
}
```

## Core Endpoints

### Health Check

#### `GET /api/health`

Check system health and database connectivity.

**Response:**
```json
{
  "status": "healthy",
  "message": "All systems operational",
  "timestamp": "2025-08-11T14:33:07.576Z",
  "uptime": 14.563479125,
  "environment": "development",
  "responseTime": "9ms",
  "checks": {
    "environment": "ok",
    "database": "ok",
    "api": "ok"
  }
}
```

**Status Codes:**
- `200` - System healthy
- `500` - System unhealthy

---

### Configuration

#### `GET /api/config`

Get all configuration data (book info, theme, marketing, etc.).

**Response:**
```json
{
  "success": true,
  "data": {
    "book": { ... },
    "marketing": { ... },
    "content": { ... },
    "theme": { ... },
    "seo": { ... },
    "email": { ... }
  }
}
```

#### `POST /api/config`

Update configuration data.

**Request Body:**
```json
{
  "book": { ... },
  "marketing": { ... },
  "content": { ... },
  "theme": { ... },
  "seo": { ... },
  "email": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration saved successfully",
  "data": { ... }
}
```

---

## Email & Download System

### Send Ebook

#### `POST /api/send-ebook`

Send ebook download link via email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Download link sent successfully",
  "messageId": "msg_123456789"
}
```

**Validation:**
- Email format validation
- Disposable email check
- Rate limiting

### Send Follow-up

#### `POST /api/send-followup`

Send follow-up email with fresh download link.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Follow-up email sent successfully",
  "data": {
    "email": "user@example.com",
    "messageId": "msg_123456789"
  }
}
```

### Validate Download Token

#### `GET /api/validate-token`

Validate a download token.

**Query Parameters:**
- `token` (required) - The download token

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "email": "user@example.com",
    "expiresAt": "2025-08-12T14:33:07.576Z",
    "used": false
  }
}
```

### Download File

#### `GET /api/download/[token]`

Download the ebook file.

**Path Parameters:**
- `token` (required) - The download token

**Query Parameters:**
- `format` (optional) - `pdf` or `epub` (defaults to configured default)

**Response:**
- `302` Redirect to actual file URL
- `400` Invalid or expired token
- `404` File not found

---

## Analytics

### Track Event

#### `POST /api/analytics`

Track detailed analytics event.

**Request Body:**
```json
{
  "action": "page_view",
  "email": "user@example.com",
  "scrollDepth": 75,
  "timeOnPage": 120000
}
```

**Available Actions:**
- `page_view` - Page view
- `scroll` - Scroll event
- `exit` - Page exit
- `email_submit` - Email submission
- `download_requested` - Download requested
- `download_completed` - Download completed

### Anonymous Analytics

#### `POST /api/analytics/anonymous`

Track GDPR-compliant anonymous analytics.

**Request Body:**
```json
{
  "type": "visit"
}
```

**Available Types:**
- `visit` - Page visit
- `download` - Download
- `email_submit` - Email submission
- `goodreads_click` - Goodreads link click
- `substack_click` - Substack link click
- `publisher_click` - Publisher link click

### Analytics Stats

#### `GET /api/analytics/stats`

Get analytics statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisits": 150,
    "totalDownloads": 45,
    "totalEmails": 67,
    "conversionRate": 30.0,
    "averageTimeOnPage": 120000,
    "anonymousVisits": 89,
    "anonymousDownloads": 23
  }
}
```

### Download Completed

#### `POST /api/analytics/download-completed`

Track completed download with metadata.

**Request Body:**
```json
{
  "token": "download_token_here",
  "downloadSize": 2048576,
  "downloadTime": 5000
}
```

---

## File Management

### Upload File

#### `POST /api/upload`

Upload file (cover image, ebook, etc.).

**Request Body:** `multipart/form-data`

**Form Fields:**
- `file` (required) - The file to upload
- `path` (optional) - Directory path (default: `files`)
- `type` (optional) - File type: `cover`, `ebook` (default: `cover`)

**Validation:**
- **Cover images**: JPEG, PNG, WebP (max 5MB)
- **Ebooks**: PDF, EPUB (max 50MB)

**Response:**
```json
{
  "publicUrl": "/uploads/covers/1754922802822-dcb3lkzn7ab.png",
  "pathname": "/path/to/file.png",
  "filename": "logo_transparent.png",
  "size": 56530,
  "type": "image/png"
}
```

### Delete File

#### `DELETE /api/upload`

Delete uploaded file.

**Request Body:**
```json
{
  "pathname": "/uploads/covers/1754922802822-dcb3lkzn7ab.png"
}
```

**Response:**
```json
{
  "ok": true
}
```

---

## A/B Testing

### Get Tests

#### `GET /api/ab-testing/tests`

Get all A/B tests.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "test_123",
      "name": "Headline Test",
      "status": "running",
      "variants": [
        {
          "id": "variant_1",
          "name": "Control",
          "is_control": true,
          "total_visitors": 150,
          "conversion_rate": 25.5
        }
      ]
    }
  ]
}
```

### Create Test

#### `POST /api/ab-testing/tests`

Create new A/B test.

**Request Body:**
```json
{
  "name": "CTA Button Test",
  "description": "Testing different CTA button colors",
  "variants": [
    {
      "name": "Blue Button",
      "is_control": true,
      "css_class": "bg-blue-600",
      "css_style": "background-color: #2563eb;"
    },
    {
      "name": "Green Button",
      "is_control": false,
      "css_class": "bg-green-600",
      "css_style": "background-color: #16a34a;"
    }
  ]
}
```

### Update Test

#### `PUT /api/ab-testing/tests/[id]`

Update A/B test.

**Path Parameters:**
- `id` (required) - Test ID

**Request Body:** Same as create test

### Delete Test

#### `DELETE /api/ab-testing/tests/[id]`

Delete A/B test and all associated data.

**Path Parameters:**
- `id` (required) - Test ID

### Track Test Event

#### `POST /api/ab-testing/track`

Track A/B test event (visit/conversion).

**Request Body:**
```json
{
  "testId": "test_123",
  "variantId": "variant_1",
  "visitorId": "visitor_456",
  "eventType": "visit"
}
```

**Event Types:**
- `visit` - Page visit
- `conversion` - Goal conversion

### Get Assignments

#### `GET /api/ab-testing/assignments`

Get visitor-variant assignments.

**Query Parameters:**
- `visitorId` (optional) - Filter by visitor ID
- `testId` (optional) - Filter by test ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "visitorId": "visitor_456",
      "testId": "test_123",
      "variantId": "variant_1",
      "assignedAt": "2025-08-11T14:33:07.576Z"
    }
  ]
}
```

### Create Assignment

#### `POST /api/ab-testing/assignments`

Assign visitor to variant.

**Request Body:**
```json
{
  "visitorId": "visitor_456",
  "testId": "test_123",
  "variantId": "variant_1"
}
```

### A/B Testing Health

#### `GET /api/ab-testing/health`

Check A/B testing system health.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "tables": {
    "ab_tests": true,
    "ab_variants": true,
    "ab_test_results": true,
    "ab_assignments": true
  }
}
```

---

## Admin Panel

### Authentication

#### `POST /api/admin/auth`

Authenticate admin user.

**Request Body:**
```json
{
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "admin",
    "email": "admin@booklandingstack.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"]
  }
}
```

#### `GET /api/admin/auth`

Check authentication status.

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": { ... }
}
```

#### `POST /api/admin/logout`

Logout admin user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Admin Stats

#### `GET /api/admin/stats`

Get comprehensive admin dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDownloads": 45,
    "downloadRequests": 67,
    "downloadCompletionRate": 67.2,
    "totalEmails": 89,
    "recentDownloads": 12,
    "recentEmails": 15,
    "anonymousVisits": 234,
    "anonymousDownloads": 45,
    "anonymousEmails": 67,
    "abTesting": [
      {
        "id": "test_123",
        "name": "Headline Test",
        "status": "running",
        "totalVisitors": 150
      }
    ],
    "analytics": [
      {
        "action": "page_view",
        "count": 150,
        "date": "2025-08-11"
      }
    ]
  }
}
```

---

## Database Management

### SQLite Backup

#### `POST /api/sqlite/backup`

Create SQLite database backup.

**Response:**
```json
{
  "success": true,
  "backupUrl": "https://backup-url.com/database.db",
  "size": 1024000,
  "createdAt": "2025-08-11T14:33:07.576Z"
}
```

#### `GET /api/sqlite/backup`

Get backup information.

**Response:**
```json
{
  "success": true,
  "data": {
    "lastBackup": "2025-08-11T14:33:07.576Z",
    "backupUrl": "https://backup-url.com/database.db",
    "size": 1024000,
    "status": "available"
  }
}
```

---

## Theme Generation

### Generate Theme from Cover

#### `POST /api/theme/from-cover`

Generate theme colors from book cover image.

**Request Body:**
```json
{
  "coverUrl": "https://example.com/cover.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "primary": "#0f172a",
    "secondary": "#334155",
    "accent": "#06b6d4",
    "muted": "#64748b"
  }
}
```

---

## Error Handling

### Standard Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid email format",
  "status": 400
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required",
  "status": 401
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "status": 404
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "status": 500
}
```

## Rate Limiting

Most endpoints have rate limiting:
- **Email endpoints**: 10 requests per minute per IP
- **Analytics endpoints**: 100 requests per minute per IP
- **Upload endpoints**: 20 requests per minute per IP

## CORS

CORS is enabled for all origins in development. For production, configure allowed origins in your environment variables.

## Testing

You can test the API using:

```bash
# Health check
curl http://localhost:3000/api/health

# Get configuration
curl http://localhost:3000/api/config

# Send test email
curl -X POST http://localhost:3000/api/send-ebook \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## SDK Examples

### JavaScript/TypeScript

```typescript
// Track analytics event
await fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'page_view',
    email: 'user@example.com'
  })
});

// Upload file
const formData = new FormData();
formData.append('file', file);
formData.append('path', 'covers');
formData.append('type', 'cover');

await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### Python

```python
import requests

# Send ebook
response = requests.post('http://localhost:3000/api/send-ebook', json={
    'email': 'user@example.com',
    'name': 'John Doe'
})

# Upload file
with open('cover.jpg', 'rb') as f:
    files = {'file': f}
    data = {'path': 'covers', 'type': 'cover'}
    response = requests.post('http://localhost:3000/api/upload', files=files, data=data)
```

### cURL

```bash
# Get admin stats
curl -H "Cookie: admin_session=..." http://localhost:3000/api/admin/stats

# Create A/B test
curl -X POST http://localhost:3000/api/ab-testing/tests \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "variants": [...]}'
```
