/**
 * Email and Download Types
 * Centralized type definitions for email and download functionality
 */

export interface EmailRequest {
  email: string
  name?: string
}

export interface EmailResponse {
  success: boolean
  message?: string
  downloadUrl?: string
  error?: string
}

export interface DownloadToken {
  id: string
  token: string
  email: string
  created_at: string
  expires_at: string
  used_at?: string
}

export interface DownloadRequest {
  token: string
}

export interface DownloadResponse {
  success: boolean
  file?: Buffer
  filename?: string
  error?: string
}

export interface TokenValidationRequest {
  token: string
}

export interface TokenValidationResponse {
  valid: boolean
  email?: string
  error?: string
} 