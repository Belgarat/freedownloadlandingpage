import { createClient } from '@supabase/supabase-js'
import { createDatabaseAdapter, DatabaseAdapter } from './database-adapter'

// Database configuration based on environment
export interface DatabaseConfig {
  provider: 'supabase' | 'railway' | 'sqlite'
  url?: string
  key?: string
  path?: string
}

// Environment-specific database configurations
const databaseConfigs: Record<string, DatabaseConfig> = {
  development: {
    provider: 'sqlite', // Usa SQLite per development (gratuito)
    path: process.env.SQLITE_DB_PATH || '/tmp/development.db'
  },
  staging: {
    provider: 'sqlite', // Usa SQLite per staging (gratuito)
    path: process.env.SQLITE_DB_PATH || '/tmp/staging.db'
  },
  production: {
    provider: 'supabase',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY
  }
}

// Get current environment
function getCurrentEnvironment(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'production'
  } else if (process.env.NODE_ENV === 'staging') {
    return 'staging'
  } else {
    return 'development'
  }
}

// Create database client based on provider
function createDatabaseClient(config: DatabaseConfig) {
  switch (config.provider) {
    case 'supabase':
      if (!config.url || !config.key) {
        throw new Error('Supabase URL and key are required')
      }
      return createClient(config.url, config.key)
    
    case 'railway':
      if (!config.url) {
        throw new Error('Railway database URL is required')
      }
      // Railway usa PostgreSQL, quindi possiamo usare Supabase client
      return createClient(config.url, config.key || '')
    
    case 'sqlite':
      if (!config.path) {
        throw new Error('SQLite database path is required')
      }
      return { path: config.path }
    
    default:
      throw new Error(`Unsupported database provider: ${config.provider}`)
  }
}

// Singleton database adapter instance
let databaseAdapter: DatabaseAdapter | null = null

// Get database adapter instance
export function getDatabaseAdapter(): DatabaseAdapter {
  if (databaseAdapter) {
    return databaseAdapter
  }

  const environment = getCurrentEnvironment()
  const config = databaseConfigs[environment]
  
  if (!config) {
    throw new Error(`No database configuration found for environment: ${environment}`)
  }

  const client = createDatabaseClient(config)
  databaseAdapter = createDatabaseAdapter(config.provider, { 
    client, 
    path: config.provider === 'sqlite' ? config.path : undefined 
  })
  
  return databaseAdapter
}

// Reset database adapter (useful for testing)
export function resetDatabaseAdapter() {
  databaseAdapter = null
}

// Database setup utilities
export async function setupDatabase() {
  const adapter = getDatabaseAdapter()
  
  // Check database connection
  try {
    await adapter.getABTests()
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Migration utilities
export async function runMigrations() {
  const adapter = getDatabaseAdapter()
  const environment = getCurrentEnvironment()
  
  console.log(`Running migrations for environment: ${environment}`)
  
  // Per ora, le migrazioni sono gestite manualmente
  // In futuro possiamo implementare un sistema di migrazioni automatiche
  console.log('✅ Migrations completed (manual setup required)')
}
