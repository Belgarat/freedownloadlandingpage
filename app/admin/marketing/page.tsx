'use client'

import { useLogout } from '@/lib/useLogout'
import { useConfig } from '@/lib/useConfig'
import { useState } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminProtected from '@/components/admin/AdminProtected'
import MarketingConfigEditor from '@/components/admin/MarketingConfigEditor'

export default function MarketingPage() {
  const { handleLogout } = useLogout()
  const { config, loading } = useConfig()
  const [localConfig, setLocalConfig] = useState(config)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Update local config when config changes
  if (config && !localConfig) {
    setLocalConfig(config)
  }

  const handleSave = async () => {
    if (!localConfig) return
    
    setSaving(true)
    setSaveStatus('idle')
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localConfig),
      })

      const result = await response.json()

      if (result.success) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }



  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Marketing Tools</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleLogout}
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

            {localConfig && (
              <MarketingConfigEditor
                config={localConfig.marketing}
                onChange={(newMarketingConfig) => {
                  setLocalConfig({
                    ...localConfig,
                    marketing: newMarketingConfig
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminProtected>
  )
}
