# 🚀 Deployment & Environment Management

## 📋 Overview

Questo progetto utilizza un workflow GitFlow modificato con deployment automatico su Vercel per gestire gli ambienti di sviluppo, staging e produzione.

### **Why Vercel Only?**

Abbiamo scelto di utilizzare esclusivamente Vercel per il deployment per i seguenti motivi:

- ✅ **Deployment automatico** su push ai branch
- ✅ **Preview deployments** per ogni PR
- ✅ **Build e test integrati** nel processo di deployment
- ✅ **Zero configurazione** per CI/CD
- ✅ **Integrazione nativa** con GitHub
- ✅ **Gestione automatica** delle variabili d'ambiente
- ✅ **Rollback automatico** in caso di errori
- ✅ **Analytics e monitoring** integrati
- ❌ **Nessuna ridondanza** con GitHub Actions
- ❌ **Nessun costo aggiuntivo** per CI/CD separato

## 🌿 Branch Strategy

```
main (production)
├── develop (staging/pre-production)
├── feature/* (feature branches)
├── release/* (release preparation)
└── hotfix/* (critical fixes)
```

### **Branch Descriptions**

- **`main`**: Branch di produzione, sempre deployabile
- **`develop`**: Branch di staging/pre-produzione, testato e stabile
- **`feature/*`**: Branch per nuove funzionalità
- **`release/*`**: Branch per preparazione release
- **`hotfix/*`**: Branch per fix critici di produzione

## 🏗️ Environment Setup

### **1. Vercel Project Configuration**

#### **Development Environment (develop branch)**
- **URL**: `https://booklandingstack-git-develop-yourusername.vercel.app`
- **Branch**: `develop`
- **Auto-deploy**: ✅ Enabled
- **Preview**: ✅ Enabled
- **Target**: `preview`
- **Database**: SQLite (`/tmp/development.db`)

#### **Production Environment (main branch)**
- **URL**: `https://booklandingstack.vercel.app`
- **Branch**: `main`
- **Auto-deploy**: ✅ Enabled
- **Preview**: ❌ Disabled
- **Target**: `production`
- **Database**: Supabase (PostgreSQL)

### **2. Environment Variables**

#### **Development Environment Variables (Vercel Dashboard)**
```bash
SQLITE_DB_PATH=/tmp/development.db
RESEND_API_KEY=your_development_resend_key
NODE_ENV=development
```

#### **Production Environment Variables (Vercel Dashboard)**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
RESEND_API_KEY=your_production_resend_key
NODE_ENV=production
```

### **3. Environment Variable Management**

#### **Vercel CLI Commands**
```bash
# Add environment variable to staging (develop branch)
vercel env add NODE_ENV staging

# Add environment variable to production (main branch)
vercel env add NODE_ENV production

# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

## 🔄 Release Workflow

### **1. Feature Development**
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Develop and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
# Create PR: feature/new-feature → develop
```

### **2. Release Preparation**
```bash
# From develop branch
npm run release:patch  # or minor/major
```

Questo comando:
- Crea un branch `release/YYYYMMDD-vX.Y.Z`
- Aggiorna la versione in `package.json`
- Aggiorna `CHANGELOG.md`
- Pusha il branch

### **3. Release Process**
```bash
# 1. Create PR: release/* → main
# 2. Run tests
npm run test:all

# 3. Deploy to staging
npm run deploy:staging

# 4. Test staging environment
# 5. Merge to main (triggers production deploy)
# 6. Tag release
git tag v1.0.0
git push origin v1.0.0
```

## 🚀 Deployment Commands

### **Manual Deployment**
```bash
# Deploy to staging (develop branch)
npm run deploy:staging

# Deploy to production (main branch)
npm run deploy:production
```

### **Vercel CLI Commands**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy current branch
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls
```

## 🧪 Testing Strategy

### **Pre-deployment Tests**
```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:component
npm run test:api
npm run test:ab-testing
npm run test:landing
```

### **Post-deployment Tests**
- [ ] Landing page loads correctly
- [ ] Email form submission works
- [ ] Admin panel accessible
- [ ] A/B testing dashboard functional
- [ ] Download flow works
- [ ] Analytics tracking active

## 📊 Monitoring & Health Checks

### **Health Check Endpoints**
- **Staging**: `https://booklandingstack-staging.vercel.app/api/health`
- **Production**: `https://booklandingstack.vercel.app/api/health`

### **A/B Testing Health**
- **Staging**: `https://booklandingstack-staging.vercel.app/api/ab-testing/health`
- **Production**: `https://booklandingstack.vercel.app/api/ab-testing/health`

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Build Failures**
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### **2. Test Failures**
```bash
# Run tests with verbose output
npm run test -- --reporter=list

# Run specific failing test
npm run test -- tests/specific-test.spec.ts
```

#### **3. Environment Variable Issues**
```bash
# Check environment variables in Vercel
vercel env ls

# Add environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

### **Rollback Strategy**
```bash
# Rollback to previous deployment
vercel rollback

# List deployments for rollback
vercel ls
```

## 📈 Performance Monitoring

### **Core Web Vitals**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### **Monitoring Tools**
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking (optional)

## 🔐 Security Checklist

### **Pre-deployment**
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers set

### **Post-deployment**
- [ ] HTTPS enforced
- [ ] Admin panel protected
- [ ] Database access restricted
- [ ] Logs monitored
- [ ] Backup strategy verified

## 📞 Emergency Procedures

### **Critical Issues**
1. **Immediate rollback**: `vercel rollback`
2. **Disable feature flags** in admin panel
3. **Contact team** via Slack/email
4. **Create hotfix branch**: `git checkout -b hotfix/critical-fix`
5. **Deploy hotfix**: `npm run deploy:production`

### **Contact Information**
- **DevOps Lead**: [Your Name]
- **Backup Contact**: [Backup Name]
- **Emergency Slack**: #devops-alerts

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
