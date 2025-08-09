'use client'

import { useAuth } from '@/lib/auth'
import { useConfig } from '@/lib/useConfig'
import { useState } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function MarketingPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const { marketingConfig, saveConfig } = useConfig()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <button
              onClick={login}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (!marketingConfig) return
    
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      await saveConfig('marketing', marketingConfig)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Marketing Tools</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>

          {saveStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Configuration saved successfully!
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error saving configuration. Please try again.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Analytics</h2>
              <p className="text-gray-600 mb-6">
                Track your marketing campaign performance.
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Total Downloads</h3>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-blue-700">+15% from last month</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-green-600">23.4%</p>
                  <p className="text-sm text-green-700">+2.1% from last month</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Email Subscriptions</h3>
                  <p className="text-2xl font-bold text-purple-600">567</p>
                  <p className="text-sm text-purple-700">+8% from last month</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900">Social Shares</h3>
                  <p className="text-2xl font-bold text-orange-600">89</p>
                  <p className="text-sm text-orange-700">+12% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">A/B Testing</h2>
              <p className="text-gray-600 mb-6">
                Manage A/B tests for your landing page.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">CTA Button Test</h3>
                    <p className="text-sm text-gray-600">Testing different button texts</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Hero Image Test</h3>
                    <p className="text-sm text-gray-600">Testing different hero images</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Paused</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Color Scheme Test</h3>
                    <p className="text-sm text-gray-600">Testing different color schemes</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Completed</span>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create New Test
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Integration</h2>
            <p className="text-gray-600 mb-6">
              Configure social media sharing and tracking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Facebook</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="facebookEnabled"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="facebookEnabled" className="text-sm">Enable Sharing</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Facebook App ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Twitter</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="twitterEnabled"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="twitterEnabled" className="text-sm">Enable Sharing</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Twitter Handle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">LinkedIn</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="linkedinEnabled"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="linkedinEnabled" className="text-sm">Enable Sharing</label>
                  </div>
                  <input
                    type="text"
                    placeholder="LinkedIn Company ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Lead Generation</h2>
            <p className="text-gray-600 mb-6">
              Configure lead capture and nurturing.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Magnet</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Free Ebook</option>
                  <option>Email Course</option>
                  <option>Checklist</option>
                  <option>Webinar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Sequence</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>3-day welcome series</option>
                  <option>7-day nurture sequence</option>
                  <option>14-day engagement series</option>
                  <option>Custom sequence</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoFollowUp"
                  className="rounded border-gray-300"
                />
                <label htmlFor="autoFollowUp" className="text-sm font-medium text-gray-700">
                  Enable automatic follow-up emails
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="leadScoring"
                  className="rounded border-gray-300"
                />
                <label htmlFor="leadScoring" className="text-sm font-medium text-gray-700">
                  Enable lead scoring
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Retargeting</h2>
            <p className="text-gray-600 mb-6">
              Configure retargeting campaigns for visitors.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Facebook Pixel</h3>
                  <p className="text-sm text-gray-600">Track conversions and create custom audiences</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Pixel ID"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Test
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Google Ads</h3>
                  <p className="text-sm text-gray-600">Track conversions and create remarketing lists</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Conversion ID"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Test
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">LinkedIn Insight Tag</h3>
                  <p className="text-sm text-gray-600">Track conversions and create matched audiences</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Partner ID"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
