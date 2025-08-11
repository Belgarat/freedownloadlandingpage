#!/bin/bash

# Local Development Setup Script
# Usage: ./scripts/setup-local.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Setting up local development environment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    print_status "Creating .env.local file..."
                cat > .env.local << 'EOF'
# ===== DATABASE CONFIGURATION =====
# Choose database engine: 'sqlite' or 'supabase'
DB_ENGINE=sqlite

# ===== SQLITE CONFIGURATION =====
# Path to SQLite database file (used when DB_ENGINE=sqlite)
SQLITE_DB_PATH=/tmp/development.db

# ===== SUPABASE CONFIGURATION =====
# These are required when DB_ENGINE=supabase
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here

# ===== SITE CONFIGURATION =====
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===== ADMIN AUTHENTICATION =====
# Password to access admin panel (/admin)
ADMIN_PASSWORD=admin123
# Secret for signing authentication cookies (change in production!)
ADMIN_SECRET=dev-secret-change-in-production

# ===== EMAIL SERVICE =====
# Use your Resend key for development
RESEND_API_KEY=your_resend_key_here

# ===== STORAGE CONFIGURATION =====
# Choose storage engine: 'filesystem' or 'vercel'
STORAGE_ENGINE=filesystem

# ===== FILESYSTEM STORAGE =====
# Files are saved to /public/uploads/ directory (used when STORAGE_ENGINE=filesystem)
# No additional configuration needed

# ===== VERCEL BLOB STORAGE =====
# Token for file upload (required when STORAGE_ENGINE=vercel)
# BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# ===== ANALYTICS =====
# For local development, analytics are always active
# (no additional configuration needed)
EOF
    print_warning "Please update RESEND_API_KEY in .env.local with your actual key"
else
    print_status ".env.local already exists"
fi

# Setup SQLite database
print_status "Setting up SQLite database..."
./scripts/setup-sqlite.sh

print_success "Local development environment setup completed!"
print_status "Next steps:"
echo ""
echo "1. Update .env.local with your RESEND_API_KEY"
echo "2. Start development server: npm run dev"
echo "3. Test the application: http://localhost:3000"
echo "4. Check database info: npm run db:info"
echo ""
echo "Environment:"
echo "  - Database: SQLite (/tmp/development.db)"
echo "  - Node Env: development"
echo "  - Email: Resend (update API key)"
