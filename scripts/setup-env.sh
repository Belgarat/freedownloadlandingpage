#!/bin/bash

# Environment Variables Setup Script for Vercel
# Usage: ./scripts/setup-env.sh [staging|production]

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

# Check if environment is specified
ENVIRONMENT=${1:-staging}
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    print_error "Invalid environment. Use: staging or production"
    exit 1
fi

print_status "Setting up environment variables for: $ENVIRONMENT"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first: npm i -g vercel"
    exit 1
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_error "Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

# Set NODE_ENV based on environment
if [[ "$ENVIRONMENT" == "staging" ]]; then
    NODE_ENV_VALUE="staging"
    print_status "Setting NODE_ENV=staging for develop branch (preview environment)"
else
    NODE_ENV_VALUE="production"
    print_status "Setting NODE_ENV=production for main branch (production environment)"
fi

# Add NODE_ENV environment variable
print_status "Adding NODE_ENV environment variable..."
echo "$NODE_ENV_VALUE" | vercel env add NODE_ENV "$ENVIRONMENT"

print_status "Environment variable added successfully!"
print_status "Note: Make sure to configure the environment in Vercel Dashboard:"
echo "   - Go to Settings → Git"
echo "   - Ensure 'develop' branch is configured for Preview environment"
echo "   - Set environment variables for Preview environment"

print_success "Environment variables configured successfully!"
print_status "Next steps:"
echo "1. Add other environment variables manually:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - RESEND_API_KEY"
echo ""
echo "2. Or use Vercel CLI:"
echo "   vercel env add VARIABLE_NAME $ENVIRONMENT"
echo ""
echo "3. List all environment variables:"
echo "   vercel env ls"
