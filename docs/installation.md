# Installation Guide

This guide will walk you through the complete installation and setup of Book Landing Stack.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Checking Your Environment

```bash
# Check Node.js version
node --version  # Should be 20.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Git version
git --version   # Should be 2.x or higher
```

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Belgarat/booklandingstack.git

# Navigate to the project directory
cd booklandingstack
```

## Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

This will install all required packages including:
- Next.js 15
- React 18
- Tailwind CSS
- Playwright (for testing)
- Better SQLite3
- And many more...

## Step 3: Environment Configuration

### Copy Environment Template

```bash
# Copy the example environment file
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local` with your specific values:

```bash
# Database Configuration
DB_ENGINE=sqlite  # Use 'sqlite' for development, 'supabase' for production
SQLITE_DB_PATH=/tmp/development.db

# Storage Configuration
STORAGE_ENGINE=filesystem  # Use 'filesystem' for development, 'vercel' for production

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Authentication
ADMIN_PASSWORD=admin123  # Change this in production!
ADMIN_SECRET=dev-secret-change-in-production  # Change this in production!

# Email Service (Required)
RESEND_API_KEY=your_resend_api_key_here

# Node Environment
NODE_ENV=development
```

### Required vs Optional Variables

**Required for Basic Setup:**
- `RESEND_API_KEY` - For sending emails

**Required for Production (Supabase):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Required for Production (Vercel Blob):**
- `BLOB_READ_WRITE_TOKEN`

**Optional (have defaults):**
- `DB_ENGINE` - Defaults to `sqlite`
- `STORAGE_ENGINE` - Defaults to `filesystem`
- `NEXT_PUBLIC_SITE_URL` - Defaults to `http://localhost:3000`
- `ADMIN_PASSWORD` - Defaults to `admin123`
- `ADMIN_SECRET` - Defaults to `dev-secret-change-in-production`
- `NODE_ENV` - Defaults to `development`

## Step 4: Database Setup

### For Development (SQLite - Recommended)

```bash
# Run the automated setup script
npm run setup:local
```

This script will:
- Create the SQLite database file
- Create all necessary tables
- Initialize with sample data
- Configure the environment for local development

### For Production (Supabase)

If you want to use Supabase for production:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Update Environment Variables**
   ```bash
   DB_ENGINE=supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Create Database Tables**
   Run the SQL commands from the [Database Setup Guide](./database.md)

## Step 5: Email Service Setup

### Resend Configuration

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account

2. **Get API Key**
   - Go to your Resend dashboard
   - Navigate to API Keys
   - Create a new API key
   - Copy the key to your `.env.local`

3. **Verify Domain**
   - Add your domain in Resend
   - Follow the verification instructions
   - This is required for sending emails

4. **Update Configuration**
   - Edit `config/email.json`
   - Set `sender.name` and `sender.email` to your verified domain

## Step 6: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 7: Verify Installation

### Check Landing Page
- Visit `http://localhost:3000`
- You should see the landing page with sample book data

### Check Admin Panel
- Visit `http://localhost:3000/admin`
- Login with:
  - **Username**: admin
  - **Password**: admin123

### Check Database
```bash
# Check database status
npm run db:info
```

### Run Tests
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:storage
npm run test:component
npm run test:api
```

## Step 8: Customize Content

### Update Book Information
1. Go to `/admin/config`
2. Edit the book information
3. Upload your book cover
4. Add your ebook files (PDF/EPUB)

### Customize Email Templates
1. In the admin panel, go to Email Templates
2. Customize the welcome email
3. Test the email sending

### Update Site Configuration
1. Edit `config/seo.json` for meta tags
2. Edit `config/theme.json` for colors and layout
3. Edit `config/marketing.json` for CTAs and social links

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill existing processes
pkill -f "next dev"

# Or use a different port
PORT=3001 npm run dev
```

**Database Connection Issues**
```bash
# Reset database
rm /tmp/development.db
npm run setup:sqlite
```

**Email Not Sending**
- Check your Resend API key
- Verify your domain in Resend
- Check the email configuration in admin panel

**File Upload Issues**
- Check storage configuration
- Ensure uploads directory exists
- Check file size limits

### Getting Help

- **Documentation**: Check the [Troubleshooting Guide](./troubleshooting.md)
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## Next Steps

After installation, you might want to:

1. **Read the [Quick Start Guide](./quick-start.md)** for basic usage
2. **Explore the [Configuration Guide](./configuration.md)** for customization
3. **Check the [Deployment Guide](./deployment.md)** for production setup
4. **Review the [API Reference](./api.md)** for integration options

## Production Considerations

Before deploying to production:

1. **Security**: Change default passwords and secrets
2. **Database**: Use Supabase or another production database
3. **Storage**: Use Vercel Blob or another cloud storage
4. **Email**: Verify your domain in Resend
5. **SSL**: Ensure HTTPS is enabled
6. **Monitoring**: Set up health checks and logging

See the [Deployment Guide](./deployment.md) for detailed production setup instructions.
