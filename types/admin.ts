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
  anonymousGoodreadsClicks: number
  anonymousSubstackClicks: number
  anonymousPublisherClicks: number
  
  // Raw data (optional)
  analytics?: any[]
  tokens?: any[]
  abTesting?: any[]
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