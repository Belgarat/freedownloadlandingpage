#!/bin/bash

# Release Management Script
# Usage: ./scripts/release.sh [patch|minor|major]

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

# Check if we're on develop branch
if [[ $(git branch --show-current) != "develop" ]]; then
    print_error "You must be on the develop branch to create a release"
    exit 1
fi

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
    print_error "Working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Get version type
VERSION_TYPE=${1:-patch}
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, or major"
    exit 1
fi

print_status "Creating release branch for version type: $VERSION_TYPE"

# Pull latest changes
print_status "Pulling latest changes from develop..."
git pull origin develop

# Create release branch
RELEASE_BRANCH="release/$(date +%Y%m%d)-v$VERSION_TYPE"
print_status "Creating release branch: $RELEASE_BRANCH"
git checkout -b "$RELEASE_BRANCH"

# Update version in package.json
print_status "Updating version in package.json..."
npm version "$VERSION_TYPE" --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_success "New version: $NEW_VERSION"

# Update CHANGELOG.md
print_status "Updating CHANGELOG.md..."
cat > CHANGELOG.md << EOF
# Changelog

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- A/B Testing System
- Admin Dashboard enhancements
- Component refactoring
- Comprehensive test suite

### Changed
- Landing page component structure
- API endpoints optimization
- Database schema improvements

### Fixed
- Playwright test automation
- Conditional rendering issues
- API response consistency

---

$(cat CHANGELOG.md 2>/dev/null || echo "")
EOF

# Commit changes
print_status "Committing release changes..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: prepare release $NEW_VERSION

- Update version to $NEW_VERSION
- Update changelog
- Prepare for production deployment"

# Push release branch
print_status "Pushing release branch..."
git push origin "$RELEASE_BRANCH"

print_success "Release branch created successfully!"
print_status "Next steps:"
echo "1. Create Pull Request: $RELEASE_BRANCH → main"
echo "2. Run tests: npm run test:all"
echo "3. Deploy to staging: vercel --prod"
echo "4. After testing, merge to main"
echo "5. Tag release: git tag v$NEW_VERSION && git push origin v$NEW_VERSION"

# Switch back to develop
git checkout develop
print_status "Switched back to develop branch"
