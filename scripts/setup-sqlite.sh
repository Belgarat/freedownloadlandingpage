#!/bin/bash

# SQLite Setup Script for Staging Environment
# Usage: ./scripts/setup-sqlite.sh

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

print_status "Setting up SQLite for staging environment..."

# Check if better-sqlite3 is installed
if ! npm list better-sqlite3 &> /dev/null; then
    print_status "Installing better-sqlite3..."
    npm install better-sqlite3 @types/better-sqlite3
fi

# Create database directory
DB_DIR="/tmp"
DB_PATH="$DB_DIR/staging.db"

print_status "Creating SQLite database at: $DB_PATH"

# Create a simple test script to initialize the database
cat > /tmp/init-sqlite.js << 'EOF'
const Database = require('better-sqlite3');
const db = new Database('/tmp/staging.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS ab_tests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    traffic_split INTEGER DEFAULT 50,
    start_date TEXT,
    end_date TEXT,
    target_element TEXT,
    target_selector TEXT,
    conversion_goal TEXT,
    statistical_significance REAL DEFAULT 0.95,
    total_visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ab_variants (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT,
    css_class TEXT,
    css_style TEXT,
    is_control BOOLEAN DEFAULT FALSE,
    is_winner BOOLEAN DEFAULT FALSE,
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate REAL DEFAULT 0,
    confidence_level REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ab_test_results (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES ab_variants (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ab_visitor_assignments (
    visitor_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (visitor_id, test_id),
    FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES ab_variants (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    visitor_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY,
    visitor_id TEXT,
    email TEXT,
    token TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert sample data
const insertTest = db.prepare(`
  INSERT OR IGNORE INTO ab_tests (
    id, name, description, type, status, traffic_split, start_date,
    target_element, target_selector, conversion_goal
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTest.run(
  'sample-test-1',
  'Sample Headline Test',
  'Testing different headlines for better conversion',
  'headline',
  'draft',
  50,
  new Date().toISOString(),
  'h1',
  '.book-title',
  'email_submission'
);

const insertVariant = db.prepare(`
  INSERT OR IGNORE INTO ab_variants (
    id, test_id, name, content, is_control
  ) VALUES (?, ?, ?, ?, ?)
`);

insertVariant.run('variant-1', 'sample-test-1', 'Control', 'Fish Cannot Carry Guns', 1);
insertVariant.run('variant-2', 'sample-test-1', 'Variant A', 'The Ultimate Guide to Success', 0);

console.log('✅ SQLite database initialized successfully!');
console.log('📊 Sample test data inserted');
console.log('🗄️ Database path: /tmp/staging.db');

db.close();
EOF

# Run the initialization script
NODE_PATH=./node_modules node /tmp/init-sqlite.js

# Clean up
rm /tmp/init-sqlite.js

print_success "SQLite setup completed!"
print_status "Next steps:"
echo ""
echo "1. Add environment variable to Vercel staging environment:"
echo "   SQLITE_DB_PATH=/tmp/staging.db"
echo ""
echo "2. Test the database connection:"
echo "   npm run test:api"
echo ""
echo "3. Check database info:"
echo "   npm run db:info"
echo ""
echo "4. Create backup:"
echo "   npm run db:backup"
echo ""
echo "5. Deploy to staging:"
echo "   git push origin develop"
