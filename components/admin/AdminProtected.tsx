'use client'

import { useAuth } from '@/lib/useAuth'
import AdminLogin from './AdminLogin'
import { useEffect, useState } from 'react'

interface AdminProtectedProps {
  children: React.ReactNode
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  console.log('[AdminProtected] Component rendered')
  const { isAuthenticated, isLoading } = useAuth()
  const [forceUpdate, setForceUpdate] = useState(0)
  const [localAuthState, setLocalAuthState] = useState<boolean | null>(null)

  console.log('[AdminProtected] State - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'localAuthState:', localAuthState)

  // Listen for auth-changed events
  useEffect(() => {
    const handleAuthChanged = (event: CustomEvent) => {
      console.log('[AdminProtected] Auth-changed event received:', event.detail)
      setLocalAuthState(event.detail.isAuthenticated)
      setForceUpdate(prev => prev + 1)
    }

    window.addEventListener('auth-changed', handleAuthChanged as EventListener)
    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged as EventListener)
    }
  }, [])

  // Use local state if available, otherwise use hook state
  const effectiveAuthState = localAuthState !== null ? localAuthState : isAuthenticated

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!effectiveAuthState) {
    return <AdminLogin />
  }

  return <>{children}</>
}
