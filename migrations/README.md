# Database Migrations

This directory contains all database migrations organized by database engine.

## Structure

```
migrations/
├── supabase/          # PostgreSQL/Supabase migrations
│   ├── 01_analytics_downloads.sql
│   ├── 02_anonymous_counters.sql
│   ├── 03_ab_testing_tables.sql
│   ├── 04_email_templates.sql
│   ├── 05_email_themes.sql
│   └── 06_email_template_analytics.sql
├── sqlite/            # SQLite migrations
│   ├── 01_analytics_downloads.sql
│   ├── 02_anonymous_counters.sql
│   ├── 03_ab_testing_tables.sql
│   ├── 04_email_templates.sql
│   ├── 05_email_themes.sql
│   └── 06_email_template_analytics.sql
├── DATABASE_SCHEMA_COMPARISON.md
├── DATABASE_ERD.md
├── DATABASE_DETAILED_SCHEMA.md
└── README.md
```

## Database Tables

### Core Tables (6)
1. **analytics** - User interaction tracking
2. **downloads** - Ebook download tracking
3. **download_tokens** - Secure download links
4. **anonymous_counters** - GDPR-compliant counters

### A/B Testing Tables (4)
5. **ab_tests** - A/B test definitions
6. **ab_variants** - Test variants
7. **ab_test_results** - Test results
8. **ab_visitor_assignments** - Visitor assignments

### Email Templates Tables (4)
9. **email_templates** - Email template definitions
10. **template_placeholders** - Template placeholders
11. **template_categories** - Template categories
12. **template_categories_assignments** - Category assignments

### Email Themes Tables (4)
13. **email_theme_categories** - Theme categories
14. **email_themes** - Theme definitions
15. **email_theme_properties** - Theme properties
16. **email_template_themes** - Theme assignments

### Email Analytics Tables (3)
17. **email_template_usage** - Template usage tracking
18. **email_template_metrics** - Aggregated metrics
19. **email_template_ab_tests** - Template A/B tests

## Usage

### Development (SQLite)
```bash
# Apply all migrations
npm run setup:new

# Or manually
sqlite3 data/landingfree.db < migrations/sqlite/01_analytics_downloads.sql
sqlite3 data/landingfree.db < migrations/sqlite/02_anonymous_counters.sql
sqlite3 data/landingfree.db < migrations/sqlite/03_ab_testing_tables.sql
sqlite3 data/landingfree.db < migrations/sqlite/04_email_templates.sql
sqlite3 data/landingfree.db < migrations/sqlite/05_email_themes.sql
sqlite3 data/landingfree.db < migrations/sqlite/06_email_template_analytics.sql
```

### Production (Supabase)
```bash
# Apply migrations in order
psql -d your_database -f migrations/supabase/01_analytics_downloads.sql
psql -d your_database -f migrations/supabase/02_anonymous_counters.sql
psql -d your_database -f migrations/supabase/03_ab_testing_tables.sql
psql -d your_database -f migrations/supabase/04_email_templates.sql
psql -d your_database -f migrations/supabase/05_email_themes.sql
psql -d your_database -f migrations/supabase/06_email_template_analytics.sql
```

## Key Differences

### Data Types
- **UUID**: PostgreSQL `UUID` → SQLite `TEXT` (custom generation)
- **Boolean**: PostgreSQL `BOOLEAN` → SQLite `INTEGER` (0/1)
- **Timestamp**: PostgreSQL `TIMESTAMP WITH TIME ZONE` → SQLite `TEXT`
- **JSON**: PostgreSQL `JSONB` → SQLite `TEXT`
- **Decimal**: PostgreSQL `DECIMAL(5,2)` → SQLite `REAL`

### Features
- **Row Level Security**: Only available in Supabase
- **Functions**: Only available in PostgreSQL
- **Triggers**: Available in both (syntax differs)

## Migration Order

Migrations must be applied in numerical order due to foreign key dependencies:

1. **Analytics & Downloads** - Core tracking tables
2. **Anonymous Counters** - GDPR counters
3. **A/B Testing** - Testing framework
4. **Email Templates** - Template system
5. **Email Themes** - Theme system (depends on templates)
6. **Email Analytics** - Analytics (depends on templates)

## Verification

After applying migrations, verify the setup:

```bash
# Check table count
sqlite3 data/landingfree.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"

# Check key tables have data
sqlite3 data/landingfree.db "SELECT COUNT(*) FROM email_templates;"
sqlite3 data/landingfree.db "SELECT COUNT(*) FROM email_themes;"
sqlite3 data/landingfree.db "SELECT COUNT(*) FROM ab_tests;"
```

Expected: 18 tables total with default data populated.

## Database Diagrams

### 📊 Entity Relationship Diagram (ERD)
See [DATABASE_ERD.md](./DATABASE_ERD.md) for a complete Entity Relationship Diagram showing all 18 tables and their relationships.

### 🔍 Detailed Schema
See [DATABASE_DETAILED_SCHEMA.md](./DATABASE_DETAILED_SCHEMA.md) for a field-level schema with all columns, data types, constraints, and detailed relationships.

### 📋 Schema Comparison
See [DATABASE_SCHEMA_COMPARISON.md](./DATABASE_SCHEMA_COMPARISON.md) for a detailed comparison between Supabase and SQLite schemas.

## Visualizing the Database

The database diagrams are written in Mermaid format and can be viewed in:
- GitHub (renders automatically)
- VS Code with Mermaid extension
- Online Mermaid editor: https://mermaid.live
- Any Markdown viewer that supports Mermaid
