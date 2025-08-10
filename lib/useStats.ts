'use client'

import { useState, useEffect } from 'react'
import { AdminStats } from '@/types/admin'

export function useStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/admin/stats', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
