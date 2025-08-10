# Book Landing Stack - Fish Cannot Carry Guns Landing Page

A beautiful Next.js 15 landing page for free ebook downloads with email collection, Resend integration, Supabase analytics tracking, and comprehensive Playwright testing. This is an example implementation of the Book Landing Stack framework.

**Version 0.2.0** - Enhanced Authentication System & Real-time Analytics

## Features

- 🎨 Modern, responsive design with teal/cyan theme
- 📧 Email collection with Resend integration
- ✅ Email verification (prevents fake/disposable emails)
- 📊 Comprehensive analytics tracking with Supabase
- 🎯 Conversion tracking for downloads
- 📱 Mobile-optimized interface
- ⚡ Fast loading with Next.js 15
- 🧪 Comprehensive Playwright test suite (12 tests)
- 🍪 GDPR-compliant cookie consent
- ♿ Accessibility optimized (ARIA, semantic HTML)
- 🔍 SEO optimized (meta tags, structured data)
- 📈 Performance optimized (image compression, lazy loading)
- 🔐 Enhanced admin panel with centralized authentication system
- 🔒 Secure login/logout with HttpOnly cookies and middleware protection
- 📊 Real-time analytics dashboard with live statistics
- ⚙️ Dynamic configuration system with JSON files
- 🎛️ User-friendly admin interface for content management
- 📝 WYSIWYG editor for rich content editing
- 🔄 Hot reload for instant configuration updates
- 📧 Advanced email template system with placeholders
- 🎯 Follow-up email automation
- 🎨 Theme customization and development flags
- 🧪 Comprehensive authentication testing with Playwright

## Book Information

This landing page is designed for the book "Fish Cannot Carry Guns" by Michael B. Morgan - a collection of speculative short stories for fans of Black Mirror, cyberpunk noir, and fringe futurism. The entire ebook is offered for free download. This serves as a reference implementation of the Book Landing Stack framework.

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

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Admin Authentication (HttpOnly cookie)
ADMIN_PASSWORD=your_secure_admin_password_here
ADMIN_SECRET=your_hmac_secret_for_cookie_token

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
```

### 2. Resend Setup

1. **Create Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Get API Key**: Go to your dashboard and copy your API key
3. **Verify Domain**: Add and verify your sending domain in Resend
4. **Set Sender in Config**: In `config/email.json`, set `sender.name` and `sender.email` to your verified domain address

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

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## Dynamic Configuration System

Book Landing Stack includes a powerful dynamic configuration system that allows you to manage all content and settings through JSON files and an intuitive admin interface.

### Configuration Files

All dynamic content is stored in JSON files in the `config/` directory:

- **`config/book.json`** - Book information, URLs, metadata
- **`config/content.json`** - WYSIWYG content areas (about book, author bio, stories)
- **`config/marketing.json`** - CTA buttons, social links, offer settings
- **`config/theme.json`** - Visual settings, colors, development flags
- **`config/seo.json`** - Meta tags, Open Graph, structured data
- **`config/email.json`** - Email templates and sender configuration

### Admin Panel

Access the admin panel at `/admin` to manage all configurations:

1. **Authentication**: Password-protected admin area
2. **Tabbed Interface**: Organized sections for different configuration types
3. **WYSIWYG Editor**: Rich text editing for content areas
4. **Real-time Updates**: Hot reload for instant configuration changes
5. **Email Templates**: Advanced template system with placeholders

### Email Template System

The email system supports dynamic placeholders that are automatically replaced:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{downloadUrl}}` | Download link | `https://example.com/download/abc123` |
| `{{name}}` | User name | `Marco` |
| `{{bookTitle}}` | Book title | `Fish Cannot Carry Guns` |
| `{{authorName}}` | Author name | `Michael B. Morgan` |
| `{{goodreadsUrl}}` | Goodreads URL | `https://goodreads.com/book/show/123` |
| `{{amazonUrl}}` | Amazon URL | `https://amazon.com/dp/B0DS55TQ8R` |
| `{{substackUrl}}` | Substack URL | `https://aroundscifi.substack.com/` |
| `{{substackName}}` | Substack Name | `Around Sci-Fi` |
| `{{publisherUrl}}` | Publisher URL | `https://37indielab.com` |
| `{{publisherName}}` | Publisher Name | `3/7 Indie Lab` |

### Email Types

1. **Download Email**: Sent immediately when user requests download
2. **Follow-up Email**: Sent 24-48 hours later if user hasn't downloaded

### Development Features

- **Hot Reload**: Automatic configuration updates in development
- **Development Flags**: Toggle analytics, tracking, and debug modes
- **Template Preview**: Real-time preview of email templates
- **Placeholder Insertion**: Easy placeholder insertion in WYSIWYG editor

### 6. Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

## Enhanced Authentication System (v0.2.0)

Book Landing Stack v0.2.0 introduces a robust, centralized authentication system with enhanced security and user experience:

### Key Improvements

- **Centralized Authentication**: Single `useAuth` hook manages all authentication state
- **Secure Cookie Management**: HttpOnly cookies with HMAC signatures prevent XSS attacks
- **Middleware Protection**: Server-side route protection with Next.js middleware
- **Event-Driven Updates**: Custom events ensure real-time UI synchronization
- **Comprehensive Testing**: Full Playwright test suite for authentication flows
- **Centralized Logout**: `useLogout` hook provides consistent logout across all admin pages

### Authentication Flow

1. **Login**: Password-based authentication with secure token generation
2. **Session Management**: Automatic session validation on each request
3. **Route Protection**: Middleware prevents unauthorized access to admin routes
4. **Logout**: Secure session termination with cookie cleanup
5. **State Synchronization**: Real-time UI updates across all admin components

### Security Features

- **HttpOnly Cookies**: Prevents client-side access to authentication tokens
- **HMAC Signatures**: Tamper-proof token validation
- **Automatic Expiration**: Configurable session timeouts
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Secure Headers**: Proper security headers via Next.js middleware

## Admin Panel

The project includes a secure admin panel accessible at `/admin` with:

- **Enhanced Authentication**: Centralized login/logout system with secure sessions
- **Real-time Analytics**: Live dashboard with download, email, and page view statistics
- **Configuration Management**: Dynamic content editing through JSON files
- **WYSIWYG Editor**: Rich text editing for content areas
- **Email Template System**: Advanced template management with placeholders
- **Real-time Updates**: Hot reload for instant configuration changes
- **Download Tracking**: Monitor ebook downloads and email collection
- **Responsive Design**: Works on all devices
- **Multi-page Admin**: Separate sections for analytics, SEO, marketing, and configuration

### Admin Features

#### Configuration Management
- **Book Information**: Title, author, metadata, URLs
- **Content Areas**: About book, author bio, stories with WYSIWYG editor
- **Marketing Settings**: CTA buttons, social links, offer configuration
- **Theme Customization**: Colors, fonts, layout options
- **SEO Settings**: Meta tags, Open Graph, structured data
- **Email Templates**: Download and follow-up email configuration

#### Email System
- **Template Editor**: WYSIWYG editor with placeholder insertion
- **Placeholder System**: Dynamic content replacement
- **Preview Function**: Real-time template preview
- **Sender Configuration**: Name, email, reply-to settings
- **Advanced Settings**: Link expiry, retry attempts, tracking

#### Analytics & Monitoring
- **Total Downloads**: Count of all ebook downloads
- **Total Emails**: Count of all collected email addresses
- **Recent Activity**: Last 7 days statistics
- **Real-time Updates**: Refresh statistics on demand
- **Secure Logout**: Clear session data

## Testing

The project includes a comprehensive Playwright test suite with 13 tests covering:

- ✅ Landing page UI elements
- ✅ Email submission functionality
- ✅ Cookie consent banner
- ✅ Download flow and token validation
- ✅ Accessibility features (ARIA, semantic HTML)
- ✅ Performance optimizations
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness

### Test Coverage

- **UI Elements**: Form validation, button states, error handling
- **Email Flow**: Submission, validation, download link generation
- **Download Process**: Token validation, file serving, analytics tracking
- **Accessibility**: ARIA labels, color contrast, keyboard navigation
- **Performance**: Image loading, meta tags, Core Web Vitals
- **Cross-browser**: Chrome, Firefox, WebKit, Mobile Safari

## Project Structure

```
booklandingstack/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   │   ├── config/        # Configuration management
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── analytics/     # Analytics tracking
│   │   ├── config/        # Configuration API
│   │   ├── download/      # Download token validation
│   │   ├── send-ebook/    # Email sending
│   │   └── send-followup/ # Follow-up email
│   ├── download/          # Download page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── admin/             # Admin panel components
│   │   ├── BookConfigEditor.tsx
│   │   ├── EmailConfigEditor.tsx
│   │   ├── MarketingConfigEditor.tsx
│   │   └── PlaceholderLegend.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── EmailTemplateEditor.tsx
│   └── WYSIWYGEditor.tsx
├── config/                # Dynamic configuration files
│   ├── book.json          # Book information and URLs
│   ├── content.json       # WYSIWYG content areas
│   ├── email.json         # Email templates and settings
│   ├── marketing.json     # CTA and social configuration
│   ├── seo.json          # SEO and meta tags
│   └── theme.json        # Visual settings and flags
├── lib/                   # Utility libraries
│   ├── config-loader.ts   # Configuration management
│   ├── book-config.ts     # Book metadata
│   ├── download-tokens.ts # Token management
│   ├── email-templates.ts # Email templates
│   ├── resend.ts          # Email service
│   ├── supabase.ts        # Database client
│   ├── useAnalytics.ts    # Analytics hooks
│   └── useConfig.ts       # Configuration hooks
├── public/                # Static assets
│   ├── ebooks/           # PDF files
│   ├── favicon.ico       # Favicon
│   └── logo_transparent.png
├── tests/                 # Playwright tests
│   └── landing-page.spec.ts
├── playwright.config.ts   # Playwright configuration
└── package.json          # Dependencies
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Admin Configuration
ADMIN_PASSWORD=your_secure_admin_password_here
```

## Deployment

The project is optimized for deployment on Vercel (recommended) or any Next.js-compatible hosting platform.

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start
### Production Deployment Guide

There are two recommended deployment modes based on the current stack:

1) Vercel (Serverless) — Recommended for production hosting
- Connect your GitHub repo to Vercel
- Vercel will detect Next.js automatically
- Ensure Node.js 20 via `engines.node` and `.nvmrc` (already present)
- Configure Environment Variables for Production and Preview:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_SITE_URL` (e.g., https://yourdomain.com)
  - `ADMIN_PASSWORD`, `ADMIN_SECRET`
  - `BLOB_READ_WRITE_TOKEN` (for cover uploads)
- Add your custom domain and set it as the production URL
- Note on Admin editing: Serverless file systems are ephemeral. Editing JSON configs via the Admin Panel will not persist across deployments. Use one of these strategies:
  - Edit JSON files locally, commit to Git, and deploy via CI (recommended)
  - Or host on a persistent server/VM with a writable volume (see mode 2)

2) Persistent Server/VM or Docker — For runtime edits via Admin Panel
- Provision a Node 20 environment (Ubuntu/Debian, Docker, etc.)
- Pull the repo and configure `.env`
- Ensure the `config/` directory resides on a writable, persistent volume
- Run `npm run build && npm start` behind a reverse proxy (Nginx/Caddy)
- This mode allows saving JSON configs at runtime from the Admin Panel

Storage for Cover Uploads (Vercel Blob)
- Generate a Read/Write token in Vercel and set `BLOB_READ_WRITE_TOKEN`
- Ensure `next.config.js` allows `*.blob.vercel-storage.com` (already configured)

Security & Auth
- Admin routes are protected by middleware checking an HttpOnly cookie
- Configure `ADMIN_PASSWORD` and `ADMIN_SECRET` (HMAC key for token)
- Cookies are `secure` in production automatically

Email Sending (Resend)
- Verify your sending domain in Resend
- Set sender in `config/email.json` under `sender`
- Customize templates (`download`, `followup`) with placeholders

Post-Deploy Checklist
- Visit `/admin` and log in
- Set Book, Content, Marketing, Theme, SEO, and Email configs
- Test cover upload; if it fails, verify `BLOB_READ_WRITE_TOKEN`
- Trigger a test download to verify email delivery and token storage
```

## Performance Features

- **Image Optimization**: WebP format with responsive sizes
- **Lazy Loading**: Images load only when needed
- **Font Optimization**: System fonts with fallbacks
- **Bundle Optimization**: Tree shaking and code splitting
- **Caching**: Static assets with proper cache headers

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Semantic HTML**: Proper heading structure and landmarks
- **Color Contrast**: WCAG AA compliant color ratios
- **Keyboard Navigation**: Full keyboard accessibility
- **Skip Links**: Quick navigation for assistive technology

## SEO Features

- **Meta Tags**: Comprehensive meta tag optimization
- **Structured Data**: JSON-LD schema markup
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Sitemap**: Automatic sitemap generation

## Versioning Strategy

Book Landing Stack follows semantic versioning (SemVer):

- **v0.x.x**: Development versions with new features and breaking changes
- **v1.x.x**: Production stable versions (planned for Q1 2025)
- **v2.x.x**: Major framework updates with new architecture

### Branch Strategy

- **main**: Production stable releases
- **develop**: Development features and testing
- **feature/***: Individual feature development
- **hotfix/***: Emergency fixes for production

## Changelog

### v0.2.0 - Enhanced Authentication System & Real-time Analytics
- **🔐 Centralized Authentication**: Implemented robust `useAuth` hook with secure session management
- **🔒 Enhanced Security**: HttpOnly cookies with HMAC signatures, middleware protection
- **📊 Real-time Analytics**: Live dashboard with download, email, and page view statistics
- **🔄 Event-Driven Updates**: Custom events ensure real-time UI synchronization across components
- **🧪 Comprehensive Testing**: Full Playwright test suite for authentication flows
- **🎯 Centralized Logout**: `useLogout` hook provides consistent logout across all admin pages
- **📱 Multi-page Admin**: Separate sections for analytics, SEO, marketing, and configuration
- **⚡ Performance**: Optimized authentication flow with minimal re-renders
- **🛡️ Security**: CSRF protection, secure headers, automatic session expiration

### v0.1.0 - Initial Release
- **🎨 Modern Design**: Responsive landing page with teal/cyan theme
- **📧 Email Collection**: Resend integration with email verification
- **📊 Analytics**: Supabase tracking with conversion monitoring
- **🔐 Admin Panel**: Password-protected configuration management
- **⚙️ Dynamic Config**: JSON-based content management system
- **📝 WYSIWYG Editor**: Rich text editing for content areas
- **📧 Email Templates**: Advanced template system with placeholders
- **🧪 Testing**: Comprehensive Playwright test suite

## Roadmap

### v1.0.0 (Q1 2025) - Production Stable
- [ ] Performance optimization and production hardening
- [ ] Advanced analytics dashboard with insights
- [ ] A/B testing framework for CTAs
- [ ] Multiple layout templates
- [ ] Community theme marketplace

### v2.0.0 (Q2 2025) - Framework Evolution
- [ ] Plugin architecture for extensibility
- [ ] Advanced SEO tools and automation
- [ ] Multi-language support
- [ ] Advanced email automation workflows
- [ ] Performance monitoring and optimization

## About Book Landing Stack

This project serves as a reference implementation of the Book Landing Stack framework - an open source solution for creating high-converting landing pages specifically designed for indie authors and book marketing.

## License

This project is licensed under the MIT License.