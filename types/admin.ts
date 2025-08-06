/**
 * Admin Dashboard Types
 * Centralized type definitions for admin functionality
 */

export interface AdminStats {
  // Consent-based analytics
  totalDownloads: number
  downloadRequests: number
  downloadCompletionRate: number
  totalEmails: number
  recentDownloads: number
  recentEmails: number
  
  // Anonymous counters (GDPR compliant)
  anonymousVisits: number
  anonymousDownloads: number
  anonymousEmails: number
  anonymousExternalLinks: number
  
  // Raw data (optional)
  analytics?: any[]
  tokens?: any[]
}

export interface AdminAuthRequest {
  password: string
}

export interface AdminAuthResponse {
  success: boolean
  message?: string
}

export interface AdminStatsResponse {
  success: boolean
  data?: AdminStats
  error?: string
} 