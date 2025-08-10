'use client'

import { useState } from 'react'
import { Plus, Play, Pause, BarChart3, Users, Target } from 'lucide-react'

interface ABTest {
  id: string
  name: string
  type: 'cta' | 'headline' | 'offer' | 'layout'
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABVariant[]
  trafficSplit: number
  startDate: string
  endDate?: string
  totalVisitors: number
  conversions: number
  conversionRate: number
}

interface ABVariant {
  id: string
  name: string
  description: string
  visitors: number
  conversions: number
  conversionRate: number
  isWinner: boolean
}

export default function ABTestingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'create'>('overview')
  const [tests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'CTA Button Color Test',
      type: 'cta',
      status: 'running',
      variants: [
        {
          id: '1a',
          name: 'Control (Blue)',
          description: 'Original blue CTA button',
          visitors: 1250,
          conversions: 89,
          conversionRate: 7.12,
          isWinner: false
        },
        {
          id: '1b',
          name: 'Variant A (Green)',
          description: 'Green CTA button',
          visitors: 1230,
          conversions: 95,
          conversionRate: 7.72,
          isWinner: true
        }
      ],
      trafficSplit: 50,
      startDate: '2025-01-15',
      totalVisitors: 2480,
      conversions: 184,
      conversionRate: 7.42
    }
  ])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tests', label: 'All Tests', icon: Target },
    { id: 'create', label: 'Create Test', icon: Plus }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cta': return '🎯'
      case 'headline': return '📝'
      case 'offer': return '💰'
      case 'layout': return '🎨'
      default: return '🧪'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.filter(t => t.status === 'running').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.reduce((sum, test) => sum + test.totalVisitors, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.length > 0 
                  ? (tests.reduce((sum, test) => sum + test.conversionRate, 0) / tests.length).toFixed(1)
                  : '0.0'
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Plus className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Created</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Tests</h3>
              <div className="space-y-4">
                {tests.slice(0, 3).map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(test.type)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <p className="text-sm text-gray-500">
                            {test.variants.length} variants • {test.trafficSplit}% traffic split
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Visitors</p>
                        <p className="font-medium">{test.totalVisitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversions</p>
                        <p className="font-medium">{test.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate</p>
                        <p className="font-medium">{test.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">All Tests</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create New Test
                </button>
              </div>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(test.type)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <p className="text-sm text-gray-500">
                            Started {new Date(test.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        {test.status === 'running' && (
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Pause className="h-4 w-4" />
                          </button>
                        )}
                        {test.status === 'paused' && (
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Variants</h5>
                        <div className="space-y-2">
                          {test.variants.map((variant) => (
                            <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{variant.name}</p>
                                <p className="text-xs text-gray-500">{variant.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{variant.conversionRate.toFixed(2)}%</p>
                                <p className="text-xs text-gray-500">{variant.visitors} visitors</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Performance</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Visitors:</span>
                            <span className="font-medium">{test.totalVisitors.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conversions:</span>
                            <span className="font-medium">{test.conversions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conversion Rate:</span>
                            <span className="font-medium">{test.conversionRate.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Create New A/B Test</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  🚧 A/B Test creation interface coming soon! This will allow you to create tests for:
                </p>
                <ul className="mt-2 text-blue-700 space-y-1">
                  <li>• CTA button text and colors</li>
                  <li>• Headline variations</li>
                  <li>• Offer messaging</li>
                  <li>• Layout changes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
