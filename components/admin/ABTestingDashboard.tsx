'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Target, Plus, Users, TrendingUp, Settings, X, Save, Play, Pause, Trash2 } from 'lucide-react'
import { ABTest, ABTestType, AB_TEST_TEMPLATES } from '@/types/ab-testing'

interface CreateTestModalProps {
  isOpen: boolean
  onClose: () => void
  template?: { type: ABTestType; template: typeof AB_TEST_TEMPLATES[ABTestType] }
  onTestCreated: () => void
}

function CreateTestModal({ isOpen, onClose, template, onTestCreated }: CreateTestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: template?.type || 'cta_button_color' as ABTestType,
    trafficSplit: 50,
    targetElement: '',
    targetSelector: '',
    conversionGoal: {
      type: 'email_submit' as const,
      value: '',
      threshold: 0
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.template.name,
        description: template.template.description,
        type: template.type,
        targetSelector: template.template.targetSelector
      }))
    }
  }, [template])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/ab-testing/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          variants: template?.template.defaultVariants || []
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create test')
      }
      
      onTestCreated()
      onClose()
      setFormData({
        name: '',
        description: '',
        type: 'cta_button_color',
        trafficSplit: 50,
        targetElement: '',
        targetSelector: '',
        conversionGoal: {
          type: 'email_submit',
          value: '',
          threshold: 0
        }
      })
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {template ? `Create Test from Template: ${template.template.name}` : 'Create New A/B Test'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ABTestType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Object.entries(AB_TEST_TEMPLATES).map(([type, template]) => (
                  <option key={type} value={type}>{template.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Split (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.trafficSplit}
                onChange={(e) => setFormData(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Selector</label>
              <input
                type="text"
                value={formData.targetSelector}
                onChange={(e) => setFormData(prev => ({ ...prev, targetSelector: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Goal</label>
            <select
              value={formData.conversionGoal.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                conversionGoal: { ...prev.conversionGoal, type: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="email_submit">Email Submit</option>
              <option value="download_click">Download Click</option>
              <option value="social_click">Social Click</option>
              <option value="scroll_depth">Scroll Depth</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Test</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ABTestingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'create'>('overview')
  const [tests, setTests] = useState<ABTest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{ type: ABTestType; template: typeof AB_TEST_TEMPLATES[ABTestType] } | undefined>(undefined)

  // Fetch real A/B testing data
  useEffect(() => {
    async function fetchTests() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/ab-testing/tests')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tests')
        }

        const data = await response.json()
        console.log('A/B Testing data loaded:', data) // Added for debugging
        setTests(data)
      } catch (err) {
        console.error('Error fetching A/B tests:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTests()
  }, [])

  const handleCreateTest = () => {
    setIsCreateModalOpen(true)
    setSelectedTemplate(undefined)
  }

  const handleUseTemplate = (type: ABTestType) => {
    setSelectedTemplate({ type, template: AB_TEST_TEMPLATES[type] })
    setIsCreateModalOpen(true)
  }

  const handleTestCreated = () => {
    // Refresh the tests list
    window.location.reload()
  }

  const handleTestStatusChange = async (testId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/ab-testing/tests/${testId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update test status')
      }
      
      // Refresh the tests list
      window.location.reload()
    } catch (error) {
      console.error('Error updating test status:', error)
      alert('Failed to update test status. Please try again.')
    }
  }

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading A/B testing data...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading A/B testing data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
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
              <p className="text-2xl font-bold text-gray-900" data-testid="active-tests-count">
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
              <p className="text-2xl font-bold text-gray-900" data-testid="total-visitors">
                {tests.reduce((sum, test) => sum + (test.total_visitors || 0), 0).toLocaleString()}
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
              <p className="text-2xl font-bold text-gray-900" data-testid="avg-conversion-rate">
                {tests.length > 0 
                  ? (tests.reduce((sum, test) => sum + (test.conversion_rate || 0), 0) / tests.length).toFixed(1)
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
          <nav className="-mb-px flex space-x-8 px-6" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
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
            <div className="space-y-6" role="tabpanel" id="tabpanel-overview">
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
                            {test.variants.length} variants • {test.traffic_split}% traffic split
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        {test.status === 'draft' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'running')}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center space-x-1"
                          >
                            <Play className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                        )}
                        {test.status === 'running' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'paused')}
                            className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 flex items-center space-x-1"
                          >
                            <Pause className="h-3 w-3" />
                            <span>Pause</span>
                          </button>
                        )}
                        {test.status === 'paused' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'running')}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center space-x-1"
                          >
                            <Play className="h-3 w-3" />
                            <span>Resume</span>
                          </button>
                        )}
                      </div>
                    </div>
                                         <div className="grid grid-cols-3 gap-4 text-sm">
                       <div>
                         <p className="text-gray-600 font-medium">Visitors</p>
                         <p className="text-lg font-bold text-gray-900">{test.total_visitors.toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-gray-600 font-medium">Conversions</p>
                         <p className="text-lg font-bold text-gray-900">{test.conversions}</p>
                       </div>
                       <div>
                         <p className="text-gray-600 font-medium">Rate</p>
                         <p className="text-lg font-bold text-gray-900">{test.conversion_rate.toFixed(2)}%</p>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-6" role="tabpanel" id="tabpanel-tests">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">All Tests</h3>
                <button 
                  onClick={handleCreateTest}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Test</span>
                </button>
              </div>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} data-testid={`test-${test.type}`} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(test.type)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <p className="text-sm text-gray-500 description">
                            {test.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        {test.status === 'draft' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'running')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center space-x-1"
                          >
                            <Play className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                        )}
                        {test.status === 'running' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'paused')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 flex items-center space-x-1"
                          >
                            <Pause className="h-3 w-3" />
                            <span>Pause</span>
                          </button>
                        )}
                        {test.status === 'paused' && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'running')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center space-x-1"
                          >
                            <Play className="h-3 w-3" />
                            <span>Resume</span>
                          </button>
                        )}
                        {(test.status === 'running' || test.status === 'paused') && (
                          <button
                            onClick={() => handleTestStatusChange(test.id, 'completed')}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center space-x-1"
                          >
                            <BarChart3 className="h-3 w-3" />
                            <span>Complete</span>
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
                                 <p className="text-lg font-bold text-gray-900">{variant.conversion_rate.toFixed(2)}%</p>
                                 {variant.is_winner && (
                                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                     Winner
                                   </span>
                                 )}
                                 {variant.is_control && (
                                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                     Control
                                   </span>
                                 )}
                               </div>
                               <p className="text-sm text-gray-600 font-medium">{variant.visitors} visitors</p>
                               {variant.confidence_level && (
                                 <p className="text-xs text-gray-500">
                                   {variant.confidence_level.toFixed(1)}% confidence
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
                             <span className="text-lg font-bold text-gray-900" data-testid="total-visitors">{test.total_visitors.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Conversions:</span>
                             <span className="text-lg font-bold text-gray-900" data-testid="total-conversions">{test.conversions}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Conversion Rate:</span>
                             <span className="text-lg font-bold text-gray-900" data-testid="conversion-rate">{test.conversion_rate.toFixed(2)}%</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-sm font-medium text-gray-700">Significance:</span>
                             <span className="text-lg font-bold text-gray-900">{test.statistical_significance.toFixed(1)}%</span>
                           </div>
                           <div className="pt-2 border-t border-gray-200">
                             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Target Element</p>
                             <p className="text-sm text-gray-700 font-medium">{test.target_element}</p>
                           </div>
                           <div>
                             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Conversion Goal</p>
                             <p className="text-sm text-gray-700 font-medium capitalize">
                               {test.conversion_goal.type.replace('_', ' ')}
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
            <div className="space-y-6" role="tabpanel" id="tabpanel-create">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Create New A/B Test</h3>
                <button 
                  onClick={handleCreateTest}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Test</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Debug: log template entries */}
                {/* {console.log('Template entries:', Object.entries(AB_TEST_TEMPLATES).map(([type, template]) => ({ type, name: template.name })))} */}
                {Object.entries(AB_TEST_TEMPLATES).map(([type, template]) => (
                  <div key={type} data-testid={`template-${type}`} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{getTypeIcon(type as ABTestType)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600 description">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Element</p>
                        <p className="text-sm text-gray-700 font-medium target">{template.targetSelector}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variants</p>
                        <p className="text-sm text-gray-700 variants">{template.defaultVariants.length} variants</p>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => handleUseTemplate(type as ABTestType)}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                        >
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
      
      {/* Create Test Modal */}
      <CreateTestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        template={selectedTemplate}
        onTestCreated={handleTestCreated}
      />
    </div>
  )
}
