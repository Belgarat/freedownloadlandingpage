# Environment Configuration

Complete guide to configuring Book Landing Stack environment variables.

## Overview

Book Landing Stack uses environment variables to configure different aspects of the application. The configuration is flexible and supports multiple environments (development, staging, production).

## Quick Setup

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` with your values:

```bash
# Required for all environments
RESEND_API_KEY=your_resend_api_key_here

# Database configuration
DB_ENGINE=sqlite  # or 'supabase'

# Storage configuration  
STORAGE_ENGINE=filesystem  # or 'vercel'

# Site configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Environment Variables Reference

### Database Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DB_ENGINE` | string | `sqlite` | Database engine: `sqlite` or `supabase` |
| `SQLITE_DB_PATH` | string | `/tmp/development.db` | SQLite database file path |
| `NEXT_PUBLIC_SUPABASE_URL` | string | - | Supabase project URL (required for Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | - | Supabase anonymous key (required for Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | string | - | Supabase service role key (required for Supabase) |

### Storage Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `STORAGE_ENGINE` | string | `filesystem` | Storage engine: `filesystem` or `vercel` |
| `BLOB_READ_WRITE_TOKEN` | string | - | Vercel Blob storage token (required for Vercel storage) |

### Email Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `RESEND_API_KEY` | string | - | **Required** - Resend API key for sending emails |

### Site Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | string | `http://localhost:3000` | Public site URL |
| `NODE_ENV` | string | `development` | Node.js environment |

### Admin Authentication

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ADMIN_PASSWORD` | string | `admin123` | Admin panel password |
| `ADMIN_SECRET` | string | `dev-secret-change-in-production` | Admin session secret |

## Environment-Specific Configurations

### Development Environment

```bash
# Database
DB_ENGINE=sqlite
SQLITE_DB_PATH=/tmp/development.db

# Storage
STORAGE_ENGINE=filesystem

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Admin (change in production!)
ADMIN_PASSWORD=admin123
ADMIN_SECRET=dev-secret-change-in-production

# Email (required)
RESEND_API_KEY=your_resend_api_key_here
```

### Production Environment (Supabase + Vercel)

```bash
# Database
DB_ENGINE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Storage
STORAGE_ENGINE=vercel
BLOB_READ_WRITE_TOKEN=your_blob_token

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production

# Admin (change these!)
ADMIN_PASSWORD=your_secure_password
ADMIN_SECRET=your_secure_secret

# Email
RESEND_API_KEY=your_resend_api_key_here
```

### Staging Environment

```bash
# Database (can use SQLite for cost savings)
DB_ENGINE=sqlite
SQLITE_DB_PATH=/tmp/staging.db

# Storage
STORAGE_ENGINE=filesystem

# Site
NEXT_PUBLIC_SITE_URL=https://staging.yourdomain.com
NODE_ENV=staging

# Admin
ADMIN_PASSWORD=staging_password
ADMIN_SECRET=staging_secret

# Email
RESEND_API_KEY=your_resend_api_key_here
```

## Database Selection Logic

The system automatically selects the database based on `DB_ENGINE`:

```typescript
// If DB_ENGINE is not set, defaults to 'sqlite'
const dbEngine = process.env.DB_ENGINE || 'sqlite'

switch (dbEngine) {
  case 'supabase':
    // Use Supabase (PostgreSQL)
    return new SupabaseAdapter()
  case 'sqlite':
  default:
    // Use SQLite
    return new SQLiteAdapter()
}
```

## Storage Selection Logic

The system automatically selects the storage provider based on `STORAGE_ENGINE`:

```typescript
// If STORAGE_ENGINE is not set, defaults to 'filesystem'
const storageEngine = process.env.STORAGE_ENGINE || 'filesystem'

switch (storageEngine) {
  case 'vercel':
    // Use Vercel Blob Storage
    return vercelBlobStorage
  case 'filesystem':
  default:
    // Use local filesystem
    return filesystemStorage
}
```

## Environment Variable Priority

1. **`.env.local`** (highest priority, not committed to Git)
2. **`.env.development`** / **`.env.production`** (environment-specific)
3. **`.env`** (fallback)
4. **System environment variables**

## Security Considerations

### Required Changes for Production

1. **Change default passwords:**
   ```bash
   ADMIN_PASSWORD=your_secure_password_here
   ADMIN_SECRET=your_secure_secret_here
   ```

2. **Use HTTPS URLs:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

3. **Use production database:**
   ```bash
   DB_ENGINE=supabase
   # or another production database
   ```

4. **Use cloud storage:**
   ```bash
   STORAGE_ENGINE=vercel
   # or another cloud storage provider
   ```

### Sensitive Variables

These variables contain sensitive information and should be kept secure:

- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `ADMIN_PASSWORD`
- `ADMIN_SECRET`

## Validation

The system validates environment variables on startup:

```bash
# Check if required variables are set
npm run validate:env

# Check database connection
npm run db:info

# Check storage configuration
npm run storage:test
```

## Troubleshooting

### Common Issues

**"supabaseUrl is required"**
- Set `DB_ENGINE=supabase` and provide Supabase credentials
- Or set `DB_ENGINE=sqlite` for local development

**"BLOB_READ_WRITE_TOKEN is required"**
- Set `STORAGE_ENGINE=vercel` and provide Vercel Blob token
- Or set `STORAGE_ENGINE=filesystem` for local development

**"RESEND_API_KEY is required"**
- Get API key from [resend.com](https://resend.com)
- Add to your `.env.local` file

**Database connection errors**
- Check database credentials
- Ensure database is running
- Verify network connectivity

### Environment Variable Debugging

```bash
# Check current environment
echo $NODE_ENV

# Check database engine
echo $DB_ENGINE

# Check storage engine
echo $STORAGE_ENGINE

# List all environment variables
env | grep -E "(DB_|STORAGE_|RESEND_|ADMIN_)"
```

## Vercel Deployment

For Vercel deployment, set environment variables in the Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate environment (Production, Preview, Development)

### Vercel Environment Variables

```bash
# Production
DB_ENGINE=supabase
STORAGE_ENGINE=vercel
NODE_ENV=production

# Preview (staging)
DB_ENGINE=sqlite
STORAGE_ENGINE=filesystem
NODE_ENV=staging
```

## Docker Configuration

For Docker deployment, use environment files:

```dockerfile
# .env.docker
DB_ENGINE=postgres
STORAGE_ENGINE=s3
NODE_ENV=production
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    env_file:
      - .env.docker
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - S3_BUCKET=${S3_BUCKET}
```

## Migration Between Environments

### From Development to Production

1. **Export development data:**
   ```bash
   npm run db:backup
   ```

2. **Update environment variables:**
   ```bash
   # Change from SQLite to Supabase
   DB_ENGINE=supabase
   # Add Supabase credentials
   ```

3. **Import data to production:**
   ```bash
   npm run db:restore
   ```

### From Production to Development

1. **Export production data:**
   ```bash
   npm run db:backup
   ```

2. **Update environment variables:**
   ```bash
   # Change from Supabase to SQLite
   DB_ENGINE=sqlite
   ```

3. **Import data to development:**
   ```bash
   npm run db:restore
   ```

## Best Practices

1. **Never commit sensitive variables** to version control
2. **Use different values** for each environment
3. **Validate configuration** on startup
4. **Document all variables** in `.env.example`
5. **Use strong passwords** in production
6. **Rotate secrets** regularly
7. **Monitor environment** for changes
8. **Backup configuration** regularly

## Next Steps

- [Installation Guide](./installation.md) - Complete setup instructions
- [Database Configuration](./database.md) - Database setup details
- [Storage Configuration](./storage.md) - File storage setup
- [Deployment Guide](./deployment.md) - Production deployment
