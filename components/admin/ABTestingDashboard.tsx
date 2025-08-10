'use client'

import { useState } from 'react'
import { Plus, Play, Pause, BarChart3, Users, Target, Settings } from 'lucide-react'
import { ABTest, ABTestType, AB_TEST_TEMPLATES } from '@/types/ab-testing'

export default function ABTestingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'create'>('overview')
  const [tests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'CTA Button Color Test',
      description: 'Testing different button colors for the main download CTA',
      type: 'cta_button_color',
      status: 'running',
      variants: [
        {
          id: '1a',
          name: 'Control (Primary)',
          description: 'Original primary color button',
          value: 'primary',
          cssClass: 'bg-[var(--color-primary)]',
          visitors: 1250,
          conversions: 89,
          conversionRate: 7.12,
          isControl: true,
          isWinner: false
        },
        {
          id: '1b',
          name: 'Variant A (Accent)',
          description: 'Accent color button',
          value: 'accent',
          cssClass: 'bg-[var(--color-accent)]',
          visitors: 1230,
          conversions: 95,
          conversionRate: 7.72,
          isControl: false,
          isWinner: true,
          confidenceLevel: 95.2,
          improvement: 8.4
        }
      ],
      trafficSplit: 50,
      startDate: '2025-01-15',
      targetElement: 'Download CTA Button',
      targetSelector: 'button[type="submit"]',
      conversionGoal: { type: 'email_submit' },
      statisticalSignificance: 95.2,
      totalVisitors: 2480,
      conversions: 184,
      conversionRate: 7.42,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-20T15:30:00Z'
    },
    {
      id: '2',
      name: 'Headline Text Test',
      description: 'Testing different headline variations',
      type: 'headline_text',
      status: 'draft',
      variants: [
        {
          id: '2a',
          name: 'Control',
          description: 'Original headline',
          value: 'Fish Cannot Carry Guns',
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          isControl: true,
          isWinner: false
        },
        {
          id: '2b',
          name: 'Variant A',
          description: 'More descriptive headline',
          value: 'Fish Cannot Carry Guns: Speculative Fiction Stories',
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          isControl: false,
          isWinner: false
        }
      ],
      trafficSplit: 50,
      startDate: '2025-02-01',
      targetElement: 'Main Headline',
      targetSelector: 'h1, .text-2xl.font-bold',
      conversionGoal: { type: 'email_submit' },
      statisticalSignificance: 0,
      totalVisitors: 0,
      conversions: 0,
      conversionRate: 0,
      createdAt: '2025-01-25T14:00:00Z',
      updatedAt: '2025-01-25T14:00:00Z'
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

  const getTypeIcon = (type: ABTestType) => {
    switch (type) {
      case 'cta_button_text':
      case 'cta_button_color': return '🎯'
      case 'headline_text':
      case 'headline_size': return '📝'
      case 'offer_text': return '💰'
      case 'social_proof': return '⭐'
      case 'form_placeholder': return '📧'
      case 'page_layout': return '🎨'
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
                         <p className="text-gray-600 font-medium">Visitors</p>
                         <p className="text-lg font-bold text-gray-900">{test.totalVisitors.toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-gray-600 font-medium">Conversions</p>
                         <p className="text-lg font-bold text-gray-900">{test.conversions}</p>
                       </div>
                       <div>
                         <p className="text-gray-600 font-medium">Rate</p>
                         <p className="text-lg font-bold text-gray-900">{test.conversionRate.toFixed(2)}%</p>
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
                               <div className="flex items-center space-x-2">
                                 <p className="text-lg font-bold text-gray-900">{variant.conversionRate.toFixed(2)}%</p>
                                 {variant.isWinner && (
                                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                     Winner
                                   </span>
                                 )}
                                 {variant.isControl && (
                                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                     Control
                                   </span>
                                 )}
                               </div>
                               <p className="text-sm text-gray-600 font-medium">{variant.visitors} visitors</p>
                               {variant.confidenceLevel && (
                                 <p className="text-xs text-gray-500">
                                   {variant.confidenceLevel.toFixed(1)}% confidence
                                 </p>
                               )}
                               {variant.improvement && (
                                 <p className="text-xs text-green-600 font-medium">
                                   +{variant.improvement.toFixed(1)}% improvement
                                 </p>
                               )}
                             </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Performance</h5>
                                                 <div className="space-y-3">
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Total Visitors:</span>
                             <span className="text-lg font-bold text-gray-900">{test.totalVisitors.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Conversions:</span>
                             <span className="text-lg font-bold text-gray-900">{test.conversions}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Conversion Rate:</span>
                             <span className="text-lg font-bold text-gray-900">{test.conversionRate.toFixed(2)}%</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Significance:</span>
                             <span className="text-lg font-bold text-gray-900">{test.statisticalSignificance.toFixed(1)}%</span>
                           </div>
                           <div className="pt-2 border-t border-gray-200">
                             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Target Element</p>
                             <p className="text-sm text-gray-700 font-medium">{test.targetElement}</p>
                           </div>
                           <div>
                             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Conversion Goal</p>
                             <p className="text-sm text-gray-700 font-medium capitalize">
                               {test.conversionGoal.type.replace('_', ' ')}
                             </p>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Create New A/B Test</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Test</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(AB_TEST_TEMPLATES).map(([type, template]) => (
                  <div key={type} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{getTypeIcon(type as ABTestType)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Element</p>
                        <p className="text-sm text-gray-700 font-medium">{template.targetSelector}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variants</p>
                        <p className="text-sm text-gray-700">{template.defaultVariants.length} variants</p>
                      </div>
                      
                      <div className="pt-2">
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Test Templates</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      These templates are based on actual elements from your landing page. Each template includes predefined variants that are commonly tested for conversion optimization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
