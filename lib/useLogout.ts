'use client'

import { useAuth } from './useAuth'

export function useLogout() {
  const { logout, checkAuth } = useAuth()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      await checkAuth()
      // Dispatch custom event to force re-render
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAuthenticated: false } }))
    }
  }

  return { handleLogout }
}
