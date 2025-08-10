'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
      console.log('[useAuth] Login attempt starting...')
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })
      
      console.log('[useAuth] Login response status:', response.status)
      
      if (response.ok) {
        console.log('[useAuth] Login successful, setting isAuthenticated to true')
        setIsAuthenticated(true)
        console.log('[useAuth] About to redirect to /admin')
        // Redirect to admin dashboard after successful login
        router.push('/admin')
        console.log('[useAuth] Redirect called')
        return true
      } else {
        console.log('[useAuth] Login failed, setting isAuthenticated to false')
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
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setIsAuthenticated(false)
      // Redirect to admin login page after logout
      router.push('/admin')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, set as not authenticated
      setIsAuthenticated(false)
      router.push('/admin')
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
