'use client'

import { useAuth } from './useAuth'

export function useLogout() {
  const { logout, checkAuth } = useAuth()

  const handleLogout = async () => {
    console.log('[useLogout] Calling logout function...')
    const success = await logout()
    console.log('[useLogout] Logout result:', success)
    if (success) {
      console.log('[useLogout] Logout successful, forcing re-check of authentication')
      await checkAuth()
      // Dispatch custom event to force re-render
      console.log('[useLogout] Dispatching auth-changed event')
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAuthenticated: false } }))
    }
  }

  return { handleLogout }
}
