# Timber - Ebook Landing Page

A beautiful Next.js 15 landing page for ebook downloads with email collection, Resend integration, and Supabase analytics tracking.

## Features

- 🎨 Modern, responsive design with teal/cyan theme
- 📧 Email collection with Resend integration
- ✅ Email verification (prevents fake/disposable emails)
- 📊 Comprehensive analytics tracking with Supabase
- 🎯 Conversion tracking for downloads
- 📱 Mobile-optimized interface
- ⚡ Fast loading with Next.js 15

## Book Information

This landing page is designed for the book "Fish Cannot Carry Guns" by Michael Morgan - a collection of speculative short stories for fans of Black Mirror, cyberpunk noir, and fringe futurism.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Resend Setup

1. **Create Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Get API Key**: Go to your dashboard and copy your API key
3. **Verify Domain**: Add and verify your sending domain in Resend
4. **Update Sender Email**: In `lib/resend.ts`, change `noreply@yourdomain.com` to your verified domain

### 3. Supabase Database Setup

Create the following tables in your Supabase database:

**Analytics Table:**
```sql
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  scroll_depth INTEGER,
  time_on_page INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Download Tokens Table:**
```sql
CREATE TABLE download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analytics_email ON analytics(email);
CREATE INDEX idx_analytics_action ON analytics(action);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_analytics_scroll_depth ON analytics(scroll_depth);
CREATE INDEX idx_download_tokens_token ON download_tokens(token);
CREATE INDEX idx_download_tokens_email ON download_tokens(email);
CREATE INDEX idx_download_tokens_expires_at ON download_tokens(expires_at);
```

### 4. Install Dependencies

```