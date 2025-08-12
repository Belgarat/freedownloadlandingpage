# Config Migration to Database - Implementation Plan

## 🎯 Overview
Migrazione graduale dei file JSON di configurazione al database per abilitare funzionalità avanzate come A/B testing, multi-tenant, e analytics.

## 📋 Current Status
- ✅ Database schema completo (18 tabelle)
- ✅ Migrazioni organizzate (Supabase/SQLite)
- ✅ Documentazione completa
- ✅ Branch feature creato: `feature/config-migration-to-database`

## 🚀 Migration Strategy: Hybrid Approach

### Phase 1: Keep JSON (Static Data)
- `book.json` - Informazioni libro (statiche)
- `seo.json` - Meta tags (statici)
- `email.json` - Template email (già nel DB)

### Phase 2: Migrate to Database (Dynamic Data)
- `marketing.json` - CTA, offerte (A/B testing)
- `theme.json` - Colori, layout (personalizzazione)
- `content.json` - Testi (multi-lingua)

## 📊 Database Schema for Config Migration

### 1. Marketing Configurations
```sql
CREATE TABLE marketing_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  cta_config TEXT, -- JSON
  modal_config TEXT, -- JSON
  offer_config TEXT, -- JSON
  social_proof_config TEXT, -- JSON
  is_active INTEGER DEFAULT 0, -- BOOLEAN
  is_default INTEGER DEFAULT 0, -- BOOLEAN
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 2. Theme Configurations
```sql
CREATE TABLE theme_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  colors TEXT, -- JSON
  fonts TEXT, -- JSON
  layout TEXT, -- JSON
  spacing TEXT, -- JSON
  animations TEXT, -- JSON
  development TEXT, -- JSON
  surface TEXT, -- JSON
  is_active INTEGER DEFAULT 0, -- BOOLEAN
  is_default INTEGER DEFAULT 0, -- BOOLEAN
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 3. Content Configurations
```sql
CREATE TABLE content_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  language TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  about_book TEXT,
  author_bio TEXT,
  stories TEXT, -- JSON
  testimonials TEXT, -- JSON
  footer TEXT, -- JSON
  is_active INTEGER DEFAULT 0, -- BOOLEAN
  is_default INTEGER DEFAULT 0, -- BOOLEAN
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 4. Configuration A/B Tests
```sql
CREATE TABLE config_ab_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_name TEXT NOT NULL,
  config_type TEXT NOT NULL, -- 'marketing', 'theme', 'content'
  config_a_id INTEGER NOT NULL,
  config_b_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
  winner_config_id INTEGER,
  confidence_level REAL,
  total_participants INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## 🛠️ Implementation Steps

### Step 1: Database Schema (Day 1-2)
- [ ] Create migration files for new config tables
- [ ] Add indexes for performance
- [ ] Create default data migration
- [ ] Test migrations on both SQLite and Supabase

### Step 2: Data Migration (Day 3)
- [ ] Create migration script to move JSON data to DB
- [ ] Validate data integrity
- [ ] Create backup of original JSON files
- [ ] Test rollback procedure

### Step 3: Backend API (Day 4-5)
- [ ] Create config service layer
- [ ] Implement CRUD operations for configs
- [ ] Add A/B testing logic
- [ ] Create config validation
- [ ] Add caching layer

### Step 4: Frontend Integration (Day 6-7)
- [ ] Update `useConfig` hook to use database
- [ ] Modify config admin interface
- [ ] Add A/B testing UI
- [ ] Implement config switching
- [ ] Add config versioning UI

### Step 5: Testing & Validation (Day 8-9)
- [ ] Unit tests for config service
- [ ] Integration tests for API
- [ ] E2E tests for admin interface
- [ ] Performance testing
- [ ] A/B testing validation

### Step 6: Deployment & Monitoring (Day 10)
- [ ] Deploy to staging
- [ ] Monitor performance
- [ ] Validate all functionality
- [ ] Create rollback plan
- [ ] Deploy to production

## 📁 File Structure Changes

### New Files to Create
```
lib/
├── config-service.ts          # Database config service
├── config-migration.ts        # JSON to DB migration
└── config-validation.ts       # Schema validation

migrations/
├── sqlite/07_config_tables.sql
└── supabase/07_config_tables.sql

components/admin/
├── ConfigABTesting.tsx        # A/B testing interface
├── ConfigVersioning.tsx       # Version management
└── ConfigSwitcher.tsx         # Config switching

types/
└── config.ts                  # Config type definitions
```

### Files to Modify
```
lib/
├── config-loader.ts           # Add DB fallback
├── useConfig.ts               # Use database first
└── database-adapter.ts        # Add config methods

app/api/config/
└── route.ts                   # Update to use DB

components/admin/
└── config/page.tsx            # Add A/B testing UI
```

## 🧪 Testing Strategy

### Unit Tests
- Config service CRUD operations
- A/B testing logic
- Data validation
- Migration scripts

### Integration Tests
- API endpoints
- Database operations
- Config switching
- A/B test assignment

### E2E Tests
- Admin interface workflow
- Config creation/editing
- A/B test management
- Performance under load

## 📈 Success Metrics

### Performance
- Config loading time < 100ms
- A/B test assignment < 50ms
- Database queries < 10ms

### Functionality
- 100% backward compatibility
- Zero data loss during migration
- All existing features working

### Business Value
- A/B testing capability
- Multi-tenant support
- Config versioning
- Analytics on config changes

## 🔄 Rollback Plan

### If Issues Arise
1. **Immediate**: Switch back to JSON files
2. **Data**: Restore from backup
3. **Code**: Revert to previous commit
4. **Database**: Drop new tables

### Rollback Triggers
- Performance degradation > 20%
- Data integrity issues
- Critical functionality broken
- User complaints > 5%

## 📅 Timeline

| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Database Schema | Migration files ready |
| 3 | Data Migration | JSON data in DB |
| 4-5 | Backend API | Config service working |
| 6-7 | Frontend Integration | Admin UI updated |
| 8-9 | Testing | All tests passing |
| 10 | Deployment | Production ready |

## 🎯 Next Steps

1. **Start with database schema** (Day 1)
2. **Create migration files**
3. **Implement config service**
4. **Update frontend gradually**
5. **Test thoroughly**
6. **Deploy incrementally**

## 📝 Notes

- Maintain backward compatibility throughout
- Keep JSON files as fallback
- Monitor performance closely
- Document all changes
- Create comprehensive tests

This migration will enable advanced features while maintaining stability and performance.
