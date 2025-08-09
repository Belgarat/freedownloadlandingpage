'use client'

import { useAuth } from '@/lib/auth'
import { useConfig } from '@/lib/useConfig'
import { useState } from 'react'

export default function AnalyticsPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const { themeConfig, saveConfig } = useConfig()
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
    if (!themeConfig) return
    
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      await saveConfig('theme', themeConfig)
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
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
              <h2 className="text-xl font-semibold mb-4">Analytics Settings</h2>
              <p className="text-gray-600 mb-6">
                Configure analytics and tracking settings for your landing page.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={themeConfig?.development.analytics || false}
                    onChange={(e) => {
                      if (themeConfig) {
                        saveConfig('theme', {
                          ...themeConfig,
                          development: { ...themeConfig.development, analytics: e.target.checked }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="analytics" className="text-sm font-medium text-gray-700">
                    Enable Analytics
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tracking"
                    checked={themeConfig?.development.tracking || false}
                    onChange={(e) => {
                      if (themeConfig) {
                        saveConfig('theme', {
                          ...themeConfig,
                          development: { ...themeConfig.development, tracking: e.target.checked }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="tracking" className="text-sm font-medium text-gray-700">
                    Enable Tracking
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="debug"
                    checked={themeConfig?.development.debug || false}
                    onChange={(e) => {
                      if (themeConfig) {
                        saveConfig('theme', {
                          ...themeConfig,
                          development: { ...themeConfig.development, debug: e.target.checked }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="debug" className="text-sm font-medium text-gray-700">
                    Enable Debug Mode
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hotReload"
                    checked={themeConfig?.development.hotReload || false}
                    onChange={(e) => {
                      if (themeConfig) {
                        saveConfig('theme', {
                          ...themeConfig,
                          development: { ...themeConfig.development, hotReload: e.target.checked }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="hotReload" className="text-sm font-medium text-gray-700">
                    Enable Hot Reload
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
              <p className="text-gray-600 mb-6">
                View analytics data and performance metrics.
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Page Views</h3>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-blue-700">+12% from last week</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Downloads</h3>
                  <p className="text-2xl font-bold text-green-600">567</p>
                  <p className="text-sm text-green-700">+8% from last week</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">45.9%</p>
                  <p className="text-sm text-purple-700">+2.1% from last week</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900">Email Subscriptions</h3>
                  <p className="text-2xl font-bold text-orange-600">89</p>
                  <p className="text-sm text-orange-700">+15% from last week</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">New download</p>
                  <p className="text-sm text-gray-600">user@example.com downloaded the ebook</p>
                </div>
                <span className="text-sm text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Email subscription</p>
                  <p className="text-sm text-gray-600">newuser@example.com subscribed to updates</p>
                </div>
                <span className="text-sm text-gray-500">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Page view</p>
                  <p className="text-sm text-gray-600">Visitor from Google search</p>
                </div>
                <span className="text-sm text-gray-500">10 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
