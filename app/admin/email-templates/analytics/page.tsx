'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Mail, Eye, MousePointer, BarChart3, Calendar, Filter } from 'lucide-react'
import { useEmailTemplates } from '@/lib/useEmailTemplates'
import type { TemplateAnalyticsSummary, AnalyticsFilters } from '@/types/email-analytics'

export default function EmailTemplateAnalyticsPage() {
  const router = useRouter()
  const { templates, loading } = useEmailTemplates()
  const [analytics, setAnalytics] = useState<TemplateAnalyticsSummary[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [filters, setFilters] = useState<AnalyticsFilters>({
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    date_to: new Date().toISOString().split('T')[0]
  })

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true)
      try {
        const response = await fetch(`/api/email-templates/analytics?${new URLSearchParams({
          date_from: filters.date_from || '',
          date_to: filters.date_to || ''
        })}`)
        
        if (response.ok) {
          const data = await response.json()
          // Merge with template names
          const analyticsWithNames = data.map((analytic: TemplateAnalyticsSummary) => {
            const template = templates.find(t => t.id === analytic.template_id)
            return {
              ...analytic,
              template_name: template?.name || 'Unknown Template'
            }
          })
          setAnalytics(analyticsWithNames)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setAnalyticsLoading(false)
      }
    }

    if (templates.length > 0) {
      fetchAnalytics()
    }
  }, [templates, filters])

  // Calculate overall metrics
  const overallMetrics = analytics.reduce((acc, analytic) => ({
    total_sent: acc.total_sent + analytic.total_sent,
    total_opened: acc.total_opened + analytic.total_opened,
    total_clicked: acc.total_clicked + analytic.total_clicked,
    total_templates: acc.total_templates + 1
  }), { total_sent: 0, total_opened: 0, total_clicked: 0, total_templates: 0 })

  const overallOpenRate = overallMetrics.total_sent > 0 
    ? (overallMetrics.total_opened / overallMetrics.total_sent) * 100 
    : 0
  const overallClickRate = overallMetrics.total_sent > 0 
    ? (overallMetrics.total_clicked / overallMetrics.total_sent) * 100 
    : 0

  const handleDateChange = (field: 'date_from' | 'date_to', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    router.push('/admin/email-templates')
  }

  if (loading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Templates</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Template Analytics</h1>
                <p className="text-sm text-gray-600">Performance metrics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Date Range:</span>
              </div>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleDateChange('date_from', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleDateChange('date_to', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                    <dd className="text-lg font-medium text-gray-900">{overallMetrics.total_sent.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{overallOpenRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MousePointer className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Click Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{overallClickRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Templates</dt>
                    <dd className="text-lg font-medium text-gray-900">{overallMetrics.total_templates}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Performance Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Template Performance</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detailed performance metrics for each template
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No analytics data available for the selected date range
                    </td>
                  </tr>
                ) : (
                  analytics
                    .sort((a, b) => b.performance_score - a.performance_score)
                    .map((analytic) => (
                      <tr key={analytic.template_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {analytic.template_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {analytic.template_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {analytic.total_sent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {analytic.total_opened.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {analytic.total_clicked.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            analytic.open_rate >= 25 ? 'bg-green-100 text-green-800' :
                            analytic.open_rate >= 15 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analytic.open_rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            analytic.click_rate >= 5 ? 'bg-green-100 text-green-800' :
                            analytic.click_rate >= 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analytic.click_rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TrendingUp className={`h-4 w-4 mr-2 ${
                              analytic.performance_score >= 20 ? 'text-green-600' :
                              analytic.performance_score >= 10 ? 'text-yellow-600' :
                              'text-red-600'
                            }`} />
                            <span className="text-sm font-medium text-gray-900">
                              {analytic.performance_score.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
