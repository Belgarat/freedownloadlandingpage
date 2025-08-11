import { StorageProvider } from '@/types/storage'
import { vercelBlobStorage } from './vercelBlob'
import { filesystemStorage } from './filesystem'

/**
 * Storage Configuration System
 * 
 * The storage provider is determined by the STORAGE_ENGINE environment variable:
 * 
 * - STORAGE_ENGINE=filesystem: Uses local filesystem storage (default for development)
 *   - Files are saved to /public/uploads/ directory
 *   - No external dependencies required
 * 
 * - STORAGE_ENGINE=vercel: Uses Vercel Blob Storage
 *   - Requires: BLOB_READ_WRITE_TOKEN
 *   - Files are stored in Vercel Blob Storage
 * 
 * Examples:
 *   STORAGE_ENGINE=filesystem npm run dev
 *   STORAGE_ENGINE=vercel npm run dev
 * 
 * If STORAGE_ENGINE is not specified, defaults to filesystem for development safety.
 */

// Determine storage provider based on STORAGE_ENGINE environment variable
function determineStorageProvider(): 'filesystem' | 'vercel' {
  const storageEngine = process.env.STORAGE_ENGINE?.toLowerCase()
  
  switch (storageEngine) {
    case 'vercel':
      return 'vercel'
    case 'filesystem':
      return 'filesystem'
    default:
      // Fallback: if STORAGE_ENGINE is not specified, use filesystem for development
      console.log('⚠️ STORAGE_ENGINE not specified, defaulting to filesystem')
      return 'filesystem'
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = determineStorageProvider()
  console.log(`📁 Using storage provider: ${provider}`)
  
  switch (provider) {
    case 'filesystem':
      return filesystemStorage
    case 'vercel':
      return vercelBlobStorage
    default:
      return filesystemStorage
  }
}

