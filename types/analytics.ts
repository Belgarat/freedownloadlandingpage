/**
 * Analytics Types
 * Centralized type definitions for analytics functionality
 */

export interface AnalyticsEvent {
  action: string
  email?: string
  timestamp?: string
  userAgent?: string
  referrer?: string
  scrollDepth?: number
  timeOnPage?: number
  metadata?: Record<string, any>
  externalLink?: string
}

export interface AnonymousAnalyticsEvent {
  action: 'page_view' | 'download_requested' | 'email_submitted' | 'external_link_click'
}

export interface AnalyticsResponse {
  success: boolean
  data?: any[]
  error?: string
}

export interface AnonymousAnalyticsResponse {
  success: boolean
  error?: string
}

export interface DownloadCompletionEvent {
  token: string
  downloadSize?: number
  downloadTime?: number
}

export interface DownloadCompletionResponse {
  success: boolean
  error?: string
} 