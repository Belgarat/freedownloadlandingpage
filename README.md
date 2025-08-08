# Book Landing Stack - Fish Cannot Carry Guns Landing Page

A beautiful Next.js 15 landing page for free ebook downloads with email collection, Resend integration, Supabase analytics tracking, and comprehensive Playwright testing. This is an example implementation of the Book Landing Stack framework.

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
- 🔐 Secure admin panel with password protection

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

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

## Admin Panel

The project includes a secure admin panel accessible at `/admin` with:

- **Password Protection**: Secure authentication with environment variable
- **Analytics Dashboard**: Real-time statistics from Supabase
- **Download Tracking**: Monitor ebook downloads and email collection
- **Responsive Design**: Works on all devices
- **Session Management**: Persistent login with sessionStorage

### Admin Features

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
│   ├── api/               # API routes
│   │   ├── analytics/     # Analytics tracking
│   │   ├── download/      # Download token validation
│   │   └── send-ebook/    # Email sending
│   ├── download/          # Download page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── AnalyticsDashboard.tsx
├── lib/                   # Utility libraries
│   ├── book-config.ts     # Book metadata
│   ├── download-tokens.ts # Token management
│   ├── email-templates.ts # Email templates
│   ├── resend.ts          # Email service
│   ├── supabase.ts        # Database client
│   └── useAnalytics.ts    # Analytics hooks
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

The project is optimized for deployment on Vercel, Netlify, or any Next.js-compatible hosting platform.

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start
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

## About Book Landing Stack

This project serves as a reference implementation of the Book Landing Stack framework - an open source solution for creating high-converting landing pages specifically designed for indie authors and book marketing.

## License

This project is licensed under the MIT License.