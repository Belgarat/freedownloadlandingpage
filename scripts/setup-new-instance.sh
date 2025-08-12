#!/bin/bash

# Setup script for new landing page instance
echo "🚀 Setting up new landing page instance..."

# Create data directory if it doesn't exist
mkdir -p data

# Create SQLite database
echo "📊 Creating SQLite database..."
touch data/landingfree.db

# Apply all migrations
echo "🔧 Applying database migrations..."

echo "  - Analytics and downloads..."
sqlite3 data/landingfree.db < migrations/sqlite/01_analytics_downloads.sql

echo "  - Anonymous counters..."
sqlite3 data/landingfree.db < migrations/sqlite/02_anonymous_counters.sql

echo "  - A/B Testing tables..."
sqlite3 data/landingfree.db < migrations/sqlite/03_ab_testing_tables.sql

echo "  - Email templates..."
sqlite3 data/landingfree.db < migrations/sqlite/04_email_templates.sql

        echo "  - Email themes..."
        sqlite3 data/landingfree.db < migrations/sqlite/05_email_themes.sql
        
        echo "  - Email template analytics..."
        sqlite3 data/landingfree.db < migrations/sqlite/06_email_template_analytics.sql
        
        echo "  - Configuration tables..."
        sqlite3 data/landingfree.db < migrations/sqlite/07_config_tables.sql

# Verify setup
echo "✅ Verifying database setup..."
TABLE_COUNT=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "  - Created $TABLE_COUNT tables"

# Check key tables have data
        AB_TESTS=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM ab_tests;")
        EMAIL_TEMPLATES=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM email_templates;")
        EMAIL_THEMES=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM email_themes;")
        MARKETING_CONFIGS=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM marketing_configs;")
        THEME_CONFIGS=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM theme_configs;")
        CONTENT_CONFIGS=$(sqlite3 data/landingfree.db "SELECT COUNT(*) FROM content_configs;")
        
        echo "  - A/B Tests: $AB_TESTS"
        echo "  - Email Templates: $EMAIL_TEMPLATES"
        echo "  - Email Themes: $EMAIL_THEMES"
        echo "  - Marketing Configs: $MARKETING_CONFIGS"
        echo "  - Theme Configs: $THEME_CONFIGS"
        echo "  - Content Configs: $CONTENT_CONFIGS"

echo ""
echo "🎉 Setup complete! You can now run:"
echo "  npm run dev"
echo ""
echo "📝 Default admin password: admin123"
echo "🌐 Access admin panel at: http://localhost:3000/admin"
