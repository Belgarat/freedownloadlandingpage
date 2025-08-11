import { createClient } from '@supabase/supabase-js'
import { createDatabaseAdapter, DatabaseAdapter } from './database-adapter'

/**
 * Database Configuration System
 * 
 * The database provider is determined by the DB_ENGINE environment variable:
 * 
 * - DB_ENGINE=sqlite: Uses SQLite database (default for development)
 *   - Requires: SQLITE_DB_PATH (optional, defaults to /tmp/development.db)
 * 
 * - DB_ENGINE=supabase: Uses Supabase PostgreSQL database
 *   - Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 
 * Examples:
 *   DB_ENGINE=sqlite npm run dev
 *   DB_ENGINE=supabase npm run dev
 * 
 * If DB_ENGINE is not specified, defaults to SQLite for development safety.
 */

// Database configuration based on environment
export interface DatabaseConfig {
  provider: 'supabase' | 'railway' | 'sqlite'
  url?: string
  key?: string
  path?: string
}

// Database configuration is now determined dynamically based on environment variables
// No need for static configurations

// Determine database provider based on DB_ENGINE environment variable
function determineDatabaseProvider(): 'supabase' | 'sqlite' {
  const dbEngine = process.env.DB_ENGINE?.toLowerCase()
  
  switch (dbEngine) {
    case 'supabase':
      return 'supabase'
    case 'sqlite':
      return 'sqlite'
    default:
      // Fallback: se DB_ENGINE non è specificato, usa SQLite per development
      console.log('⚠️ DB_ENGINE not specified, defaulting to SQLite')
      return 'sqlite'
  }
}

// Create database client based on provider
function createDatabaseClient(provider: 'supabase' | 'sqlite') {
  switch (provider) {
    case 'supabase':
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (!url || !key) {
        throw new Error('DB_ENGINE=supabase requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
      }
      return createClient(url, key)
    
    case 'sqlite':
      const path = process.env.SQLITE_DB_PATH || '/tmp/development.db'
      return { path }
    
    default:
      throw new Error(`Unsupported database provider: ${provider}`)
  }
}

// Singleton database adapter instance
let databaseAdapter: DatabaseAdapter | null = null

// Get database adapter instance
export function getDatabaseAdapter(): DatabaseAdapter {
  if (databaseAdapter) {
    return databaseAdapter
  }

  const provider = determineDatabaseProvider()
  console.log(`🗄️ Using database provider: ${provider}`)
  
  const client = createDatabaseClient(provider)
  databaseAdapter = createDatabaseAdapter(provider, { 
    client, 
    path: provider === 'sqlite' ? (client as any).path : undefined 
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
  const provider = determineDatabaseProvider()
  
  console.log(`Running migrations for provider: ${provider}`)
  
  // Per ora, le migrazioni sono gestite manualmente
  // In futuro possiamo implementare un sistema di migrazioni automatiche
  console.log('✅ Migrations completed (manual setup required)')
}
