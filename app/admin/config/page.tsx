'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '@/lib/useConfig'
import { Save, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ConfigData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  book?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marketing?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seo?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  email?: any
}
import BookConfigEditor from '@/components/admin/BookConfigEditor'
import MarketingConfigEditor from '@/components/admin/MarketingConfigEditor'
import ContentConfigEditor from '@/components/admin/ContentConfigEditor'
import ThemeConfigEditor from '@/components/admin/ThemeConfigEditor'
import SEOConfigEditor from '@/components/admin/SEOConfigEditor'
import EmailConfigEditor from '@/components/admin/EmailConfigEditor'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function ConfigAdmin() {
  const { config, loading, error } = useConfig()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('book')
  const [localConfig, setLocalConfig] = useState<ConfigData | null>(null)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [preventReload, setPreventReload] = useState(false)

  useEffect(() => {
    // Evita sovrascritture durante modifica o salvataggio
    if (config && (!localConfig || (!isDirty && !saving && !preventReload))) {
      setLocalConfig(config)
    }
  }, [config, isDirty, saving, preventReload])

  const handleSave = async () => {
    if (!localConfig) return

    setSaving(true)
    setPreventReload(true) // Prevent reload during save

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
        // Show success toast
        addToast({
          type: 'success',
          title: 'Configuration Saved',
          message: 'Your changes have been saved successfully.',
          duration: 3000
        })
        
        // Don't update localConfig immediately to avoid flash
        // Just mark as not dirty
        setIsDirty(false)
        
        setTimeout(() => {
          setPreventReload(false) // Allow reload after save status clears
        }, 3000)
      } else {
        // Show error toast
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: result.error || 'Failed to save configuration.',
          duration: 5000
        })
        
        setTimeout(() => {
          setPreventReload(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error saving config:', error)
      
      // Show error toast
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'An unexpected error occurred while saving.',
        duration: 5000
      })
      
      setTimeout(() => {
        setPreventReload(false)
      }, 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleReload = () => {
    window.location.reload()
  }

  const tabs = [
    { id: 'book', name: 'Book', color: 'blue' },
    { id: 'marketing', name: 'Marketing', color: 'green' },
    { id: 'content', name: 'Content', color: 'purple' },
    { id: 'theme', name: 'Theme', color: 'orange' },
    { id: 'seo', name: 'SEO', color: 'red' },
    { id: 'email', name: 'Email', color: 'indigo' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">!</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Configuration</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleReload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!localConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No configuration available</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'book':
        return (
          <BookConfigEditor
            config={localConfig.book}
            onChange={(newBookConfig) => { setLocalConfig({...localConfig, book: newBookConfig}); setIsDirty(true) }}
          />
        )
      case 'marketing':
        return (
          <MarketingConfigEditor
            config={localConfig.marketing}
            onChange={(newMarketingConfig) => { setLocalConfig({...localConfig, marketing: newMarketingConfig}); setIsDirty(true) }}
          />
        )
      case 'content':
        return (
          <ContentConfigEditor
            config={localConfig.content}
            onChange={(newContentConfig) => { setLocalConfig({...localConfig, content: newContentConfig}); setIsDirty(true) }}
          />
        )
      case 'theme':
        return (
          <ThemeConfigEditor
            config={localConfig.theme}
            onChange={(newThemeConfig) => { setLocalConfig({...localConfig, theme: newThemeConfig}); setIsDirty(true) }}
          />
        )
      case 'seo':
        return (
          <SEOConfigEditor
            config={localConfig.seo}
            onChange={(newSEOConfig) => { setLocalConfig({...localConfig, seo: newSEOConfig}); setIsDirty(true) }}
          />
        )
      case 'email':
        return (
          <EmailConfigEditor
            config={localConfig.email}
            onChange={(newEmailConfig) => { setLocalConfig({...localConfig, email: newEmailConfig}); setIsDirty(true) }}
          />
        )
      default:
        return null
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
              <span className="text-sm text-gray-600">Manage your landing page settings</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReload}
                className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-3 py-2 text-white rounded-md flex items-center space-x-2 text-sm transition-all duration-200 ${
                  saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 rounded-t-lg font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-2 border-${tab.color}-500`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-${tab.color}-500`}></div>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Saving overlay */}
        {saving && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 font-medium">Saving configuration...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
