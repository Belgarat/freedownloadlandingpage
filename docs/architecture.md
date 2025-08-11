# System Architecture

Overview of Book Landing Stack's architecture, design decisions, and technical implementation.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Database      │    │   Email         │
│   (React)       │    │   Adapter       │    │   (Resend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Configuration │    │   Storage       │    │   Analytics     │
│   (JSON Files)  │    │   Adapter       │    │   (Anonymous)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Components

### 1. Frontend Layer

**Technology Stack:**
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

**Key Components:**
- **Landing Page** - Main book presentation and email capture
- **Admin Panel** - Configuration and analytics dashboard
- **A/B Testing UI** - Test management and results visualization
- **File Upload** - Cover and ebook management

### 2. Backend Layer

**API Routes (Next.js App Router):**
```
/api/
├── health/                 # System health checks
├── config/                 # Configuration management
├── send-ebook/            # Email delivery
├── send-followup/         # Follow-up emails
├── download/[token]/      # File downloads
├── validate-token/        # Token validation
├── analytics/             # Event tracking
│   ├── route.ts           # Detailed analytics
│   ├── anonymous/         # GDPR-compliant tracking
│   ├── stats/             # Analytics statistics
│   └── download-completed/ # Download tracking
├── ab-testing/            # A/B testing system
│   ├── tests/             # Test management
│   ├── track/             # Event tracking
│   ├── assignments/       # Visitor assignments
│   └── health/            # System health
├── admin/                 # Admin operations
│   ├── auth/              # Authentication
│   ├── stats/             # Dashboard statistics
│   └── logout/            # Session management
├── upload/                # File management
├── sqlite/                # Database operations
│   └── backup/            # Backup management
└── theme/                 # Theme generation
    └── from-cover/        # Color extraction
```

### 3. Database Layer

**Adapter Pattern Implementation:**

```typescript
interface DatabaseAdapter {
  // A/B Testing
  createABTest(data: ABTest): Promise<ABTest>
  getABTests(): Promise<ABTest[]>
  updateABTest(id: string, data: Partial<ABTest>): Promise<ABTest>
  deleteABTest(id: string): Promise<void>
  
  // Analytics
  trackVisit(data: AnalyticsData): Promise<void>
  getAnalyticsStats(): Promise<AnalyticsStats>
  incrementAnonymousCounter(type: string): Promise<void>
  getAnonymousCounters(): Promise<AnonymousCounters>
  
  // Downloads
  createDownloadToken(email: string): Promise<DownloadToken>
  validateDownloadToken(token: string): Promise<DownloadToken>
  getDownloadTokens(): Promise<DownloadToken[]>
}

class SupabaseAdapter implements DatabaseAdapter {
  // PostgreSQL implementation via Supabase
}

class SQLiteAdapter implements DatabaseAdapter {
  // SQLite implementation for development
}
```

**Supported Databases:**
- **SQLite** - Local development and staging
- **Supabase (PostgreSQL)** - Production

### 4. Storage Layer

**Adapter Pattern Implementation:**

```typescript
interface StorageProvider {
  uploadFile(file: File | Blob | Buffer, opts?: UploadOptions): Promise<UploadResult>
  deleteFile(pathname: string): Promise<void>
}

class VercelBlobStorage implements StorageProvider {
  // Cloud storage via Vercel Blob
}

class FilesystemStorage implements StorageProvider {
  // Local filesystem storage
}
```

**Supported Storage:**
- **Filesystem** - Local development and staging
- **Vercel Blob** - Production cloud storage

## Data Flow

### 1. Email Capture Flow

```
User Input → Form Validation → API Call → Database → Email Service → Success Response
     │              │              │           │           │              │
     ▼              ▼              ▼           ▼           ▼              ▼
Landing Page → Client Validation → /api/send-ebook → SQLite/Supabase → Resend → UI Update
```

### 2. Analytics Flow

```
User Action → Event Tracking → API Call → Database → Statistics Update
     │              │              │           │           │
     ▼              ▼              ▼           ▼           ▼
Page View → useAnalytics Hook → /api/analytics → SQLite/Supabase → Admin Dashboard
```

### 3. A/B Testing Flow

```
Visitor → Variant Assignment → Content Rendering → Event Tracking → Results Analysis
   │              │                    │                │                │
   ▼              ▼                    ▼                ▼                ▼
Landing Page → /api/ab-testing/assignments → React Components → /api/ab-testing/track → Admin Dashboard
```

## Configuration System

### Dynamic Configuration

**JSON-based Configuration:**
```
config/
├── book.json          # Book information
├── marketing.json     # Marketing settings
├── content.json       # Content sections
├── theme.json         # Visual styling
├── seo.json          # SEO metadata
└── email.json        # Email templates
```

**Configuration Loading:**
```typescript
// Frontend
const config = useConfig() // React hook for configuration

// Backend
const config = await loadConfig() // Server-side configuration loading
```

### Environment-based Configuration

**Environment Variables:**
- `DB_ENGINE` - Database selection (sqlite/supabase)
- `STORAGE_ENGINE` - Storage selection (filesystem/vercel)
- `RESEND_API_KEY` - Email service configuration
- `NODE_ENV` - Environment mode

## Security Architecture

### Authentication

**Admin Authentication:**
- Session-based authentication
- Password-protected admin panel
- Secure session management

**API Security:**
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS configuration
- Error handling without information leakage

### Data Protection

**GDPR Compliance:**
- Anonymous analytics tracking
- Optional email tracking
- Data retention policies
- User consent management

**File Security:**
- File type validation
- Size limits
- Secure file storage
- Access control

## Performance Architecture

### Frontend Optimization

**Next.js Optimizations:**
- Static generation where possible
- Image optimization
- Code splitting
- Bundle analysis

**React Optimizations:**
- Memoization with React.memo
- useMemo for expensive calculations
- useCallback for event handlers
- Lazy loading of components

### Backend Optimization

**Database Optimization:**
- Connection pooling
- Query optimization
- Indexing strategies
- Caching layer

**API Optimization:**
- Response caching
- Request batching
- Async processing
- Error boundaries

## Scalability Considerations

### Horizontal Scaling

**Stateless Design:**
- No server-side state
- Database as single source of truth
- Session storage in database

**Load Balancing:**
- Multiple server instances
- Database read replicas
- CDN for static assets

### Vertical Scaling

**Resource Optimization:**
- Memory-efficient database queries
- Optimized file storage
- Efficient caching strategies

## Monitoring and Observability

### Health Checks

**System Health:**
- Database connectivity
- External service status
- File system access
- API response times

**Application Metrics:**
- Request/response times
- Error rates
- Database performance
- Storage usage

### Logging

**Structured Logging:**
- Request/response logging
- Error tracking
- Performance metrics
- User activity

## Testing Architecture

### Test Pyramid

```
    E2E Tests (Playwright)
         ▲
    Integration Tests
         ▲
    Unit Tests (Vitest)
```

**Testing Strategy:**
- **Unit Tests** - Individual functions and components
- **Integration Tests** - API endpoints and database operations
- **E2E Tests** - Complete user workflows
- **Visual Tests** - UI component testing

### Test Coverage

**Areas Covered:**
- API endpoints
- Database operations
- File uploads
- Email sending
- A/B testing
- Analytics tracking
- Admin operations

## Deployment Architecture

### Multi-Environment Support

**Environment Types:**
- **Development** - Local development with SQLite
- **Staging** - Pre-production testing
- **Production** - Live environment with Supabase

**Deployment Pipeline:**
```
Code → Tests → Build → Deploy → Health Check → Monitor
```

### Infrastructure

**Vercel Deployment:**
- Serverless functions
- Edge caching
- Global CDN
- Automatic scaling

**Database Strategy:**
- Development: SQLite (local)
- Staging: SQLite (cost-effective)
- Production: Supabase (scalable)

## Future Architecture Considerations

### Planned Improvements

**Microservices Migration:**
- Separate email service
- Dedicated analytics service
- File management service
- A/B testing service

**Advanced Features:**
- Real-time analytics
- Webhook integrations
- Advanced A/B testing
- Multi-tenant support

### Technology Evolution

**Framework Updates:**
- Next.js version upgrades
- React concurrent features
- TypeScript improvements
- Performance optimizations

**Infrastructure Evolution:**
- Database scaling strategies
- Storage optimization
- CDN improvements
- Monitoring enhancements

## Conclusion

Book Landing Stack is designed with:

- **Modularity** - Adapter patterns for flexibility
- **Scalability** - Stateless design for horizontal scaling
- **Security** - Comprehensive security measures
- **Performance** - Optimized for speed and efficiency
- **Maintainability** - Clean architecture and testing
- **Flexibility** - Environment-based configuration

The architecture supports both simple deployments and complex enterprise requirements while maintaining simplicity for indie authors and publishers.
