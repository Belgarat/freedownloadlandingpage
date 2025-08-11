# API Quick Start Guide

Get up and running with the Book Landing Stack API in minutes.

## 🚀 Quick Examples

### Send Ebook to User

```bash
curl -X POST http://localhost:3000/api/send-ebook \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reader@example.com",
    "name": "John Doe"
  }'
```

### Track Page View

```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "action": "page_view",
    "email": "reader@example.com"
  }'
```

### Upload Book Cover

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@cover.jpg" \
  -F "path=covers" \
  -F "type=cover"
```

### Get Analytics Stats

```bash
curl http://localhost:3000/api/analytics/stats
```

## 📧 Email Workflow

```javascript
// 1. User submits email
const emailResponse = await fetch('/api/send-ebook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'reader@example.com',
    name: 'John Doe'
  })
});

// 2. Track the submission
await fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'email_submit',
    email: 'reader@example.com'
  })
});
```

## 📊 Analytics Tracking

```javascript
// Page view
await fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'page_view',
    email: 'reader@example.com'
  })
});

// Anonymous tracking (GDPR compliant)
await fetch('/api/analytics/anonymous', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'visit'
  })
});
```

## 🎯 A/B Testing

```javascript
// Create A/B test
const testResponse = await fetch('/api/ab-testing/tests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'CTA Button Test',
    variants: [
      {
        name: 'Blue Button',
        is_control: true,
        css_class: 'bg-blue-600'
      },
      {
        name: 'Green Button',
        is_control: false,
        css_class: 'bg-green-600'
      }
    ]
  })
});

// Track test events
await fetch('/api/ab-testing/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    testId: 'test_456',
    variantId: 'variant_1',
    visitorId: 'visitor_123',
    eventType: 'visit'
  })
});
```

## 📁 File Management

```javascript
// Upload file
const formData = new FormData();
formData.append('file', file);
formData.append('path', 'covers');
formData.append('type', 'cover');

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

// Delete file
await fetch('/api/upload', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pathname: '/uploads/covers/file.jpg'
  })
});
```

## 🔐 Admin Operations

```javascript
// Login
const loginResponse = await fetch('/api/admin/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    password: 'admin123'
  })
});

// Get admin stats
const statsResponse = await fetch('/api/admin/stats', {
  headers: {
    'Cookie': 'admin_session=...' // Use cookie from login
  }
});
```

## 🐍 Python Example

```python
import requests

class BookLandingAPI:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
    
    def send_ebook(self, email, name):
        response = requests.post(f"{self.base_url}/api/send-ebook", json={
            "email": email,
            "name": name
        })
        return response.json()
    
    def track_analytics(self, action, email=None, **kwargs):
        data = {"action": action}
        if email:
            data["email"] = email
        data.update(kwargs)
        
        response = requests.post(f"{self.base_url}/api/analytics", json=data)
        return response.json()

# Usage
api = BookLandingAPI()
result = api.send_ebook("reader@example.com", "John Doe")
api.track_analytics("page_view", "reader@example.com")
```

## 🚨 Error Handling

```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}
```

## 📋 Common Use Cases

### Newsletter Signup Flow
1. User submits email via `/api/send-ebook`
2. Track signup via `/api/analytics`
3. Send welcome email (automatic)
4. Track engagement via `/api/analytics/anonymous`

### Book Launch Campaign
1. Create A/B test via `/api/ab-testing/tests`
2. Track performance via `/api/analytics/stats`
3. Monitor conversions via `/api/admin/stats`

## 🔗 Next Steps

- Read the [Complete API Reference](./api.md) for detailed documentation
- Check [Authentication Guide](./authentication.md) for secure integrations
- Explore [Webhook Integration](./webhooks.md) for real-time updates
