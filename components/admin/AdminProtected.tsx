'use client'

import { useAuth } from '@/lib/useAuth'
import AdminLogin from './AdminLogin'

interface AdminProtectedProps {
  children: React.ReactNode
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { isAuthenticated, isLoading } = useAuth()

  console.log('[AdminProtected] State - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)

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

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <>{children}</>
}
