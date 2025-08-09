import { randomBytes } from 'crypto'

export interface DownloadToken {
  id: string
  email: string
  token: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}

export const generateDownloadToken = (email: string): DownloadToken => {
  const id = randomBytes(16).toString('hex')
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  return {
    id,
    email,
    token,
    expiresAt,
    used: false,
    createdAt: new Date()
  }
}

export const validateDownloadToken = (token: string, email: string): boolean => {
  // This would typically check against database
  // For now, we'll implement basic validation
  return token.length === 64 && email.includes('@')
}

export const createDownloadUrl = (token: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fishcannotcarryguns.aroundscifi.us'
  return `${baseUrl}/download/${token}`
} 