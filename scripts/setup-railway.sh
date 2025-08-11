#!/bin/bash

# Railway Setup Script for Staging Environment
# Usage: ./scripts/setup-railway.sh

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

print_status "Setting up Railway for staging environment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_status "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    print_error "Not logged in to Railway. Please run: railway login"
    exit 1
fi

# Create new project if not exists
print_status "Creating Railway project..."
if ! railway project &> /dev/null; then
    railway init --name "booklandingstack-staging"
fi

# Add PostgreSQL service
print_status "Adding PostgreSQL service..."
railway add postgresql

# Get database URL
print_status "Getting database connection details..."
DATABASE_URL=$(railway variables get DATABASE_URL)
if [ -z "$DATABASE_URL" ]; then
    print_error "Failed to get DATABASE_URL from Railway"
    exit 1
fi

print_success "Railway setup completed!"
print_status "Database URL: $DATABASE_URL"

# Instructions for next steps
print_status "Next steps:"
echo ""
echo "1. Add environment variables to Vercel staging environment:"
echo "   RAILWAY_DATABASE_URL=$DATABASE_URL"
echo "   RAILWAY_DATABASE_KEY=your_railway_key"
echo ""
echo "2. Run database migrations:"
echo "   psql $DATABASE_URL < migrations/ab_testing_tables.sql"
echo ""
echo "3. Test the connection:"
echo "   npm run test:api"
echo ""
echo "4. Deploy to staging:"
echo "   git push origin develop"
