import { StorageProvider } from '@/types/storage'
import { vercelBlobStorage } from './vercelBlob'

export function getStorageProvider(): StorageProvider {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'vercel'
  switch (provider) {
    case 'vercel':
      return vercelBlobStorage
    // case 's3': return s3Storage
    // case 'supabase': return supabaseStorage
    default:
      return vercelBlobStorage
  }
}

