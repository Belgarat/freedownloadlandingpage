'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        credentials: 'include',
      })
      setIsAuthenticated(response.ok)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (password: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        return true
      } else {
        setIsAuthenticated(false)
        return false
      }
    } catch (error) {
      console.error('[useAuth] Login error:', error)
      setIsAuthenticated(false)
      return false
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        setIsAuthenticated(false)
        return true
      } else {
        setIsAuthenticated(false)
        return false
      }
    } catch (error) {
      console.error('[useAuth] Logout error:', error)
      // Even if logout fails, set as not authenticated
      setIsAuthenticated(false)
      return false
    }
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }
}
