import { useState, useEffect } from 'react'

// Simple authentication utilities for admin access
// In production, you should use a proper authentication system

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  permissions: string[]
}

// Simple session management
export class AdminAuth {
  static readonly SESSION_KEY = 'admin_session'
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  static login(password: string): boolean {
    // In production, this should validate against a database
    // For now, we'll use a simple password check
    const validPasswords = [
      'admin123', // Default password
      'booklandingstack2025', // Production password
    ]

    if (validPasswords.includes(password)) {
      const session = {
        user: {
          id: 'admin',
          email: 'admin@booklandingstack.com',
          role: 'admin' as const,
          permissions: ['read', 'write', 'delete']
        },
        expiresAt: Date.now() + this.SESSION_DURATION
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
      }
      return true
    }

    return false
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY)
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return false

      const session = JSON.parse(sessionData)
      
      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        this.logout()
        return false
      }

      return true
    } catch {
      return false
    }
  }

  static getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null

    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session = JSON.parse(sessionData)
      
      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        this.logout()
        return null
      }

      return session.user
    } catch {
      return null
    }
  }

  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    return user.permissions.includes(permission)
  }

  static requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
      }
      return false
    }
    return true
  }
}

// React hook for authentication
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuth.isAuthenticated()
      const currentUser = AdminAuth.getCurrentUser()
      
      setIsAuthenticated(authenticated)
      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AdminAuth.SESSION_KEY) {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (password: string): boolean => {
    const success = AdminAuth.login(password)
    if (success) {
      setIsAuthenticated(true)
      setUser(AdminAuth.getCurrentUser())
    }
    return success
  }

  const logout = () => {
    AdminAuth.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    return AdminAuth.hasPermission(permission)
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    hasPermission
  }
}
