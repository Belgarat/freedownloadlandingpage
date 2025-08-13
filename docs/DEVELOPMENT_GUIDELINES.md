# Development Guidelines - BookLandingStack

## 📋 Indice
1. [Backup Strategy](#backup-strategy)
2. [Database Management](#database-management)
3. [Code Standards](#code-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [API Development](#api-development)
6. [UI/UX Standards](#uiux-standards)
7. [Git Workflow](#git-workflow)
8. [Error Handling](#error-handling)
9. [Security Guidelines](#security-guidelines)
10. [Performance Guidelines](#performance-guidelines)

---

## 🔄 Backup Strategy

### **REGOLE FONDAMENTALI**
- ✅ **MAI cancellare/modificare file senza backup**
- ✅ **Sempre backup prima di operazioni critiche**
- ✅ **Retention di 10 backup per sicurezza**
- ✅ **Backup automatici per database**

### **Backup Database**
```bash
# Backup SQLite
cp /tmp/development.db /tmp/development.db.backup.$(date +%Y%m%d_%H%M%S)

# Backup con retention (mantiene solo gli ultimi 10)
ls -t /tmp/development.db.backup.* | tail -n +11 | xargs rm -f
```

### **Backup File di Configurazione**
```bash
# Backup JSON configs (se ancora usati)
cp -r config/ config.backup.$(date +%Y%m%d_%H%M%S)/
```

### **Script di Backup Automatico**
```bash
#!/bin/bash
# scripts/backup.sh
BACKUP_DIR="/tmp/backups"
mkdir -p $BACKUP_DIR

# Backup database
cp /tmp/development.db $BACKUP_DIR/development.db.backup.$(date +%Y%m%d_%H%M%S)

# Mantieni solo gli ultimi 10 backup
ls -t $BACKUP_DIR/development.db.backup.* | tail -n +11 | xargs rm -f

echo "Backup completato: $(date)"
```

---

## 🗄️ Database Management

### **REGOLE FONDAMENTALI**
- ✅ **Un solo database per ambiente** (no duplicati)
- ✅ **Migrations sempre in ordine cronologico**
- ✅ **Test delle migrations prima di applicarle**
- ✅ **Backup prima di ogni migration**

### **Struttura Migrations**
```
migrations/
├── sqlite/
│   ├── 01_initial_schema.sql
│   ├── 02_add_email_templates.sql
│   └── 08_add_template_type.sql
└── supabase/
    ├── 01_initial_schema.sql
    └── 02_add_email_templates.sql
```

### **Applicazione Migrations**
```bash
# Backup prima
cp /tmp/development.db /tmp/development.db.backup.$(date +%Y%m%d_%H%M%S)

# Applica migration
sqlite3 /tmp/development.db < migrations/sqlite/08_add_template_type.sql
```

### **Database Adapter Pattern**
- ✅ **Interfaccia comune** per SQLite e Supabase
- ✅ **Transform methods** per mappare DB → Frontend
- ✅ **JSON parsing automatico** nei transform methods
- ✅ **Gestione errori consistente**

---

## 💻 Code Standards

### **TypeScript**
- ✅ **Sempre tipi espliciti** (no `any` se possibile)
- ✅ **Interfacce separate** in file dedicati
- ✅ **Import/export organizzati**
- ✅ **ESLint rules seguite**

### **React/Next.js**
- ✅ **Componenti funzionali** con hooks
- ✅ **Props tipizzate** con interfacce
- ✅ **Error boundaries** per gestione errori
- ✅ **Loading states** per UX migliore

### **File Organization**
```
components/
├── admin/          # Componenti admin
├── landing/        # Componenti landing page
└── ui/            # Componenti UI generici

lib/
├── database-adapter.ts    # Database abstraction
├── config-service.ts      # Business logic
└── genre-service.ts       # Genre-specific logic

types/
├── config.ts             # Configuration types
├── database.ts           # Database types
└── genre-templates.ts    # Genre-specific types
```

---

## 🧪 Testing Guidelines

### **REGOLE FONDAMENTALI**
- ✅ **Test unitari** per business logic
- ✅ **Test E2E** per flussi critici
- ✅ **Test API** per tutti gli endpoint
- ✅ **Cleanup** dopo ogni test

### **Naming Convention**
```
tests/
├── unit/                 # Test unitari
│   ├── config-service.test.ts
│   └── database-adapter.test.ts
├── e2e/                  # Test end-to-end
│   ├── admin.e2e.spec.ts
│   └── landing-page.e2e.spec.ts
└── api/                  # Test API
    └── config.test.ts
```

### **Test Structure**
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  it('should do something', async () => {
    // Test
  })
})
```

---

## 🔌 API Development

### **REGOLE FONDAMENTALI**
- ✅ **Next.js 15**: `params` deve essere awaited
- ✅ **Error handling** consistente
- ✅ **Status codes** appropriati
- ✅ **Response format** standardizzato

### **API Route Structure**
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // Next.js 15 requirement
    
    // Business logic
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### **Response Format**
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}

// Error
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

---

## 🎨 UI/UX Standards

### **REGOLE FONDAMENTALALI**
- ✅ **Loading states** per tutte le operazioni
- ✅ **Toast notifications** per feedback
- ✅ **Prevenzione UI "flashing"**
- ✅ **Error states** chiari

### **Component Patterns**
```typescript
// Loading state
{isLoading && <LoadingSpinner />}

// Error state
{error && <ErrorMessage error={error} />}

// Success feedback
{showToast && <Toast message="Success!" type="success" />}
```

### **Form Handling**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false)
const [preventReload, setPreventReload] = useState(false)

const handleSubmit = async (data) => {
  setIsSubmitting(true)
  setPreventReload(true)
  
  try {
    await saveData(data)
    showToast('Saved successfully!')
  } catch (error) {
    showToast('Error saving data', 'error')
  } finally {
    setIsSubmitting(false)
    setPreventReload(false)
  }
}
```

---

## 🔄 Git Workflow

### **REGOLE FONDAMENTALI**
- ✅ **Branch per features** (`feature/nome-feature`)
- ✅ **Commit atomici** e descrittivi
- ✅ **Pull request** per merge
- ✅ **Versioning semantico**

### **Branch Strategy**
```
main                    # Production
├── develop            # Development
├── feature/email-templates
├── feature/genre-templates
└── hotfix/critical-bug
```

### **Commit Messages**
```
feat: add email template management
fix: resolve JSON parsing error in email config
docs: update development guidelines
refactor: improve database adapter pattern
```

---

## ⚠️ Error Handling

### **REGOLE FONDAMENTALI**
- ✅ **Try/catch** in tutte le operazioni async
- ✅ **Logging** dettagliato degli errori
- ✅ **User-friendly** error messages
- ✅ **Graceful degradation**

### **Error Patterns**
```typescript
// API Error
try {
  const result = await operation()
  return NextResponse.json(result)
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Operation failed' },
    { status: 500 }
  )
}

// Component Error
try {
  const data = await fetchData()
  setData(data)
} catch (error) {
  console.error('Failed to fetch data:', error)
  setError('Failed to load data')
}
```

---

## 🔒 Security Guidelines

### **REGOLE FONDAMENTALI**
- ✅ **Input validation** sempre
- ✅ **SQL injection** prevention
- ✅ **XSS protection**
- ✅ **Environment variables** per secrets

### **Validation Patterns**
```typescript
// Input validation
if (!id || isNaN(parseInt(id))) {
  return NextResponse.json(
    { error: 'Invalid ID' },
    { status: 400 }
  )
}

// SQL injection prevention (usando prepared statements)
const stmt = this.db.prepare('SELECT * FROM table WHERE id = ?')
const result = stmt.get(id)
```

---

## ⚡ Performance Guidelines

### **REGOLE FONDAMENTALI**
- ✅ **Lazy loading** per componenti pesanti
- ✅ **Memoization** per calcoli costosi
- ✅ **Database indexing** appropriato
- ✅ **Bundle optimization**

### **Performance Patterns**
```typescript
// Memoization
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Database indexing
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
```

---

## 📝 Checklist Pre-Commit

### **Prima di ogni commit:**
- [ ] **Backup database** se modifiche DB
- [ ] **Test unitari** passano
- [ ] **Linting** senza errori
- [ ] **TypeScript** compila
- [ ] **Documentazione** aggiornata

### **Prima di ogni merge:**
- [ ] **Test E2E** passano
- [ ] **Code review** completata
- [ ] **Performance** verificata
- [ ] **Security** verificata

---

## 🚨 Emergency Procedures

### **Database Corrotto**
```bash
# 1. Stop server
pkill -f "npm run dev"

# 2. Restore from backup
cp /tmp/development.db.backup.$(ls -t /tmp/development.db.backup.* | head -1) /tmp/development.db

# 3. Restart server
npm run dev
```

### **Migration Fallita**
```bash
# 1. Rollback database
cp /tmp/development.db.backup.$(ls -t /tmp/development.db.backup.* | head -1) /tmp/development.db

# 2. Fix migration script
# 3. Test migration locally
# 4. Re-apply migration
```

---

## 📚 Documentazione

### **File da mantenere aggiornati:**
- ✅ `README.md` - Overview del progetto
- ✅ `docs/DEVELOPMENT_GUIDELINES.md` - Questo file
- ✅ `docs/PHASE1_GENRE_TEMPLATES.md` - Documentazione features
- ✅ `docs/API.md` - Documentazione API
- ✅ `docs/DATABASE.md` - Schema database

### **Swagger/OpenAPI**
- ✅ **Auto-generazione** da commenti JSDoc
- ✅ **Endpoint documentation** completa
- ✅ **Request/Response examples**

---

## 🔧 Tools e Scripts

### **Script Utili**
```bash
# Backup database
./scripts/backup.sh

# Setup nuovo ambiente
./scripts/setup-new-instance.sh

# Test API
./scripts/test-admin-apis.js

# Migrazione config
npm run config:migrate
```

### **Comandi Frequenti**
```bash
# Development
npm run dev
npm run build
npm run test:unit
npm run test:e2e

# Database
sqlite3 /tmp/development.db ".tables"
sqlite3 /tmp/development.db "SELECT * FROM email_templates;"
```

---

## 📞 Support e Troubleshooting

### **Problemi Comuni**

#### **"no such table" Error**
```bash
# Soluzione: Applica migrations
sqlite3 /tmp/development.db < migrations/sqlite/08_add_template_type.sql
```

#### **JSON Parse Error**
```typescript
// Problema: JSON.parse su oggetto già parsato
// Soluzione: Usa direttamente l'oggetto
const templates = activeConfig.templates || {}
```

#### **Next.js 15 Warning**
```typescript
// Problema: params non awaited
// Soluzione: await params
const { id } = await params
```

### **Debug Tips**
- ✅ **Console logging** dettagliato
- ✅ **Database inspection** con sqlite3
- ✅ **Network tab** per API calls
- ✅ **React DevTools** per component state

---

*Ultimo aggiornamento: $(date)*
*Versione: 1.0*
