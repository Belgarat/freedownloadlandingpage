'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import type { TemplateAnalyticsSummary, AnalyticsChartData } from '@/types/email-analytics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

interface EmailAnalyticsChartsProps {
  analytics: TemplateAnalyticsSummary[]
  dateRange: { from: string; to: string }
}

export default function EmailAnalyticsCharts({ analytics, dateRange }: EmailAnalyticsChartsProps) {
  const chartRef = useRef<ChartJS>(null)

  // Performance over time (simulated data for now)
  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Open Rate',
        data: [22, 25, 28, 24],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Click Rate',
        data: [2.5, 3.1, 3.8, 3.2],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Template performance comparison
  const templatePerformanceData = {
    labels: analytics.map(a => a.template_name),
    datasets: [
      {
        label: 'Open Rate (%)',
        data: analytics.map(a => a.open_rate),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Click Rate (%)',
        data: analytics.map(a => a.click_rate),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1
      }
    ]
  }

  // Email volume by template
  const emailVolumeData = {
    labels: analytics.map(a => a.template_name),
    datasets: [
      {
        label: 'Emails Sent',
        data: analytics.map(a => a.total_sent),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Performance distribution
  const performanceDistributionData = {
    labels: ['Excellent (≥20%)', 'Good (10-20%)', 'Poor (<10%)'],
    datasets: [
      {
        data: [
          analytics.filter(a => a.performance_score >= 20).length,
          analytics.filter(a => a.performance_score >= 10 && a.performance_score < 20).length,
          analytics.filter(a => a.performance_score < 10).length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Email Performance Metrics'
      }
    }
  }

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Performance Trends Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      }
    }
  }

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Template Performance Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      }
    }
  }

  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Performance Distribution'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
        <div className="h-80">
          <Line data={performanceData} options={lineChartOptions} />
        </div>
      </div>

      {/* Template Performance Comparison */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Template Performance Comparison</h3>
        <div className="h-80">
          <Bar data={templatePerformanceData} options={barChartOptions} />
        </div>
      </div>

      {/* Email Volume and Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Volume by Template</h3>
          <div className="h-80">
            <Bar 
              data={emailVolumeData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Email Volume by Template'
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Distribution</h3>
          <div className="h-80">
            <Doughnut data={performanceDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.length}
            </div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.filter(a => a.performance_score >= 20).length}
            </div>
            <div className="text-sm text-gray-600">Excellent Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {analytics.filter(a => a.performance_score >= 10 && a.performance_score < 20).length}
            </div>
            <div className="text-sm text-gray-600">Good Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {analytics.filter(a => a.performance_score < 10).length}
            </div>
            <div className="text-sm text-gray-600">Needs Improvement</div>
          </div>
        </div>
      </div>
    </div>
  )
}
