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
# ===== LOCAL DEVELOPMENT =====
# Database: SQLite (gratuito per development)
SQLITE_DB_PATH=/tmp/development.db
NODE_ENV=development

# ===== EMAIL SERVICE =====
# Usa la tua chiave Resend per development
RESEND_API_KEY=your_resend_key_here

# ===== PRODUCTION DATABASE (COMMENTATO) =====
# Non usato in development locale
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
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
