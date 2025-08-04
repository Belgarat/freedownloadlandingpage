'use client'

import { useEffect, useState } from 'react'
import { Users, MousePointer, Download, Clock } from 'lucide-react'

interface AnalyticsStats {
  pageViews: number
  scrollToBottom: number
  emailSubmissions: number
  avgTimeOnPage: number
  conversionRate: number
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats>({
    pageViews: 0,
    scrollToBottom: 0,
    emailSubmissions: 0,
    avgTimeOnPage: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      }
    }

    // Fetch initial stats
    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.pageViews}</div>
          <div className="text-sm text-gray-600">Page Views</div>
        </div>
        <div className="text-center">
          <MousePointer className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.scrollToBottom}</div>
          <div className="text-sm text-gray-600">Scrolled to Bottom</div>
        </div>
        <div className="text-center">
          <Download className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.emailSubmissions}</div>
          <div className="text-sm text-gray-600">Email Submissions</div>
        </div>
        <div className="text-center">
          <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(stats.avgTimeOnPage / 1000)}s
          </div>
          <div className="text-sm text-gray-600">Avg Time on Page</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-gray-900">
          Conversion Rate: {stats.conversionRate.toFixed(1)}%
        </div>
      </div>
    </div>
  )
} 