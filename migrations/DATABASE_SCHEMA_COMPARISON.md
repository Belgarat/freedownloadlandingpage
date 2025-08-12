# Database Schema Comparison

## Overview
This document compares the database schemas for Supabase (PostgreSQL) and SQLite to ensure all tables and fields are properly migrated.

## Tables Summary

### 1. Analytics & Downloads
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `analytics` | ✅ | ✅ | ✅ Complete |
| `downloads` | ✅ | ✅ | ✅ Complete |
| `download_tokens` | ✅ | ✅ | ✅ Complete |

### 2. Anonymous Counters
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `anonymous_counters` | ✅ | ✅ | ✅ Complete |

### 3. A/B Testing
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `ab_tests` | ✅ | ✅ | ✅ Complete |
| `ab_variants` | ✅ | ✅ | ✅ Complete |
| `ab_test_results` | ✅ | ✅ | ✅ Complete |
| `ab_visitor_assignments` | ✅ | ✅ | ✅ Complete |

### 4. Email Templates
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `email_templates` | ✅ | ✅ | ✅ Complete |
| `template_placeholders` | ✅ | ✅ | ✅ Complete |
| `template_categories` | ✅ | ✅ | ✅ Complete |
| `template_categories_assignments` | ✅ | ✅ | ✅ Complete |

### 5. Email Themes
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `email_theme_categories` | ✅ | ✅ | ✅ Complete |
| `email_themes` | ✅ | ✅ | ✅ Complete |
| `email_theme_properties` | ✅ | ✅ | ✅ Complete |
| `email_template_themes` | ✅ | ✅ | ✅ Complete |

### 6. Email Template Analytics
| Table | Supabase | SQLite | Status |
|-------|----------|--------|--------|
| `email_template_usage` | ✅ | ✅ | ✅ Complete |
| `email_template_metrics` | ✅ | ✅ | ✅ Complete |
| `email_template_ab_tests` | ✅ | ✅ | ✅ Complete |

## Total Tables: 18 ✅

## Key Differences Between Supabase and SQLite

### Data Types
| PostgreSQL Type | SQLite Type | Notes |
|----------------|-------------|-------|
| `UUID` | `TEXT` | Custom UUID generation in SQLite |
| `SERIAL` | `INTEGER AUTOINCREMENT` | Auto-incrementing primary keys |
| `BOOLEAN` | `INTEGER` | 0/1 values in SQLite |
| `TIMESTAMP WITH TIME ZONE` | `TEXT` | `datetime('now')` in SQLite |
| `JSONB` | `TEXT` | JSON stored as text in SQLite |
| `DECIMAL(5,2)` | `REAL` | Floating point in SQLite |
| `VARCHAR(255)` | `TEXT` | No length limit in SQLite |

### Constraints
| Feature | Supabase | SQLite | Notes |
|---------|----------|--------|-------|
| Foreign Keys | ✅ | ✅ | Both support |
| Unique Constraints | ✅ | ✅ | Both support |
| Check Constraints | ✅ | ✅ | Both support |
| Row Level Security | ✅ | ❌ | Supabase only |
| Triggers | ✅ | ✅ | Both support |
| Functions | ✅ | ❌ | PostgreSQL only |

### Indexes
All performance indexes are identical between both databases.

### Default Data
All default data (categories, templates, themes) is identical between both databases.

## Migration Files Structure

### Supabase (PostgreSQL)
```
migrations/supabase/
├── 01_analytics_downloads.sql
├── 02_anonymous_counters.sql
├── 03_ab_testing_tables.sql
├── 04_email_templates.sql
├── 05_email_themes.sql
└── 06_email_template_analytics.sql
```

### SQLite
```
migrations/sqlite/
├── 01_analytics_downloads.sql
├── 02_anonymous_counters.sql
├── 03_ab_testing_tables.sql
├── 04_email_templates.sql
├── 05_email_themes.sql
└── 06_email_template_analytics.sql
```

## Verification Checklist

- [x] All 18 tables present in both schemas
- [x] All field names match between schemas
- [x] All data types properly converted
- [x] All constraints properly adapted
- [x] All indexes created
- [x] All default data inserted
- [x] All foreign key relationships maintained
- [x] All triggers and functions adapted

## Usage

### For Supabase (Production)
```bash
# Apply migrations in order
psql -d your_database -f migrations/supabase/01_analytics_downloads.sql
psql -d your_database -f migrations/supabase/02_anonymous_counters.sql
psql -d your_database -f migrations/supabase/03_ab_testing_tables.sql
psql -d your_database -f migrations/supabase/04_email_templates.sql
psql -d your_database -f migrations/supabase/05_email_themes.sql
psql -d your_database -f migrations/supabase/06_email_template_analytics.sql
```

### For SQLite (Development)
```bash
# Apply migrations in order
sqlite3 data/landingfree.db < migrations/sqlite/01_analytics_downloads.sql
sqlite3 data/landingfree.db < migrations/sqlite/02_anonymous_counters.sql
sqlite3 data/landingfree.db < migrations/sqlite/03_ab_testing_tables.sql
sqlite3 data/landingfree.db < migrations/sqlite/04_email_templates.sql
sqlite3 data/landingfree.db < migrations/sqlite/05_email_themes.sql
sqlite3 data/landingfree.db < migrations/sqlite/06_email_template_analytics.sql
```

## Notes

1. **UUID Generation**: SQLite uses a custom function to generate UUIDs since it doesn't have a built-in UUID type.
2. **Boolean Handling**: SQLite stores booleans as integers (0/1) and the application layer handles the conversion.
3. **JSON Storage**: SQLite stores JSON as text, while PostgreSQL uses JSONB for better performance.
4. **Row Level Security**: Only available in Supabase/PostgreSQL.
5. **Triggers**: Both databases support triggers, but the syntax differs slightly.

All migrations are complete and ready for use! 🎉
