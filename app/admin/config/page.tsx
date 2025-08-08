'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '@/lib/useConfig'
import { BookConfig, MarketingConfig, ContentConfig, ThemeConfig, SEOConfig, EmailConfig } from '@/lib/config-loader'
import { Save, RefreshCw, Eye, EyeOff, Settings, BookOpen, Megaphone, Palette, Search, Mail } from 'lucide-react'

export default function ConfigAdmin() {
  const { config, loading, error } = useConfig()
  const [activeTab, setActiveTab] = useState('book')
  const [isEditing, setIsEditing] = useState(false)
  const [editConfig, setEditConfig] = useState<any>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    if (config) {
      setEditConfig(JSON.parse(JSON.stringify(config))) // Deep copy
    }
  }, [config])

  const handleSave = async () => {
    if (!editConfig) return

    setSaveStatus('saving')
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editConfig),
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      setSaveStatus('error')
    }
  }

  const handleReset = () => {
    if (config) {
      setEditConfig(JSON.parse(JSON.stringify(config)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Configuration Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!config || !editConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No configuration available</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'book', name: 'Book Info', icon: BookOpen },
    { id: 'marketing', name: 'Marketing', icon: Megaphone },
    { id: 'content', name: 'Content', icon: Settings },
    { id: 'theme', name: 'Theme', icon: Palette },
    { id: 'seo', name: 'SEO', icon: Search },
    { id: 'email', name: 'Email', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Book Landing Stack - Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saveStatus === 'saving' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="ml-2">
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'saved' ? 'Saved!' : 
                   saveStatus === 'error' ? 'Error' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              <div className="p-6">
                {activeTab === 'book' && (
                  <BookConfigEditor 
                    config={editConfig.book} 
                    onChange={(bookConfig) => setEditConfig({...editConfig, book: bookConfig})}
                  />
                )}
                {activeTab === 'marketing' && (
                  <MarketingConfigEditor 
                    config={editConfig.marketing} 
                    onChange={(marketingConfig) => setEditConfig({...editConfig, marketing: marketingConfig})}
                  />
                )}
                {activeTab === 'content' && (
                  <ContentConfigEditor 
                    config={editConfig.content} 
                    onChange={(contentConfig) => setEditConfig({...editConfig, content: contentConfig})}
                  />
                )}
                {activeTab === 'theme' && (
                  <ThemeConfigEditor 
                    config={editConfig.theme} 
                    onChange={(themeConfig) => setEditConfig({...editConfig, theme: themeConfig})}
                  />
                )}
                {activeTab === 'seo' && (
                  <SEOConfigEditor 
                    config={editConfig.seo} 
                    onChange={(seoConfig) => setEditConfig({...editConfig, seo: seoConfig})}
                  />
                )}
                {activeTab === 'email' && (
                  <EmailConfigEditor 
                    config={editConfig.email} 
                    onChange={(emailConfig) => setEditConfig({...editConfig, email: emailConfig})}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Book Config Editor
function BookConfigEditor({ config, onChange }: { config: BookConfig, onChange: (config: BookConfig) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({...config, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => onChange({...config, subtitle: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={config.author}
            onChange={(e) => onChange({...config, author: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <input
            type="text"
            value={config.coverImage}
            onChange={(e) => onChange({...config, coverImage: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={config.rating}
            onChange={(e) => onChange({...config, rating: parseFloat(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
          <input
            type="number"
            min="0"
            value={config.reviewCount}
            onChange={(e) => onChange({...config, reviewCount: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={config.description}
          onChange={(e) => onChange({...config, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories (comma separated)</label>
        <input
          type="text"
          value={config.categories.join(', ')}
          onChange={(e) => onChange({...config, categories: e.target.value.split(',').map(s => s.trim())})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

// Marketing Config Editor
function MarketingConfigEditor({ config, onChange }: { config: MarketingConfig, onChange: (config: MarketingConfig) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Primary CTA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <input
              type="text"
              value={config.cta.primary.text}
              onChange={(e) => onChange({
                ...config, 
                cta: {...config.cta, primary: {...config.cta.primary, text: e.target.value}}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtext</label>
            <input
              type="text"
              value={config.cta.primary.subtext}
              onChange={(e) => onChange({
                ...config, 
                cta: {...config.cta, primary: {...config.cta.primary, subtext: e.target.value}}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amazon URL</label>
            <input
              type="url"
              value={config.cta.social.amazon.url}
              onChange={(e) => onChange({
                ...config, 
                cta: {
                  ...config.cta, 
                  social: {...config.cta.social, amazon: {...config.cta.social.amazon, url: e.target.value}}
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goodreads URL</label>
            <input
              type="url"
              value={config.cta.social.goodreads.url}
              onChange={(e) => onChange({
                ...config, 
                cta: {
                  ...config.cta, 
                  social: {...config.cta.social, goodreads: {...config.cta.social.goodreads, url: e.target.value}}
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Content Config Editor
function ContentConfigEditor({ config, onChange }: { config: ContentConfig, onChange: (config: ContentConfig) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Book (HTML)</label>
        <textarea
          value={config.aboutBook}
          onChange={(e) => onChange({...config, aboutBook: e.target.value})}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="<p>Enter HTML content here...</p>"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio (HTML)</label>
        <textarea
          value={config.authorBio}
          onChange={(e) => onChange({...config, authorBio: e.target.value})}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="<p>Enter HTML content here...</p>"
        />
      </div>
    </div>
  )
}

// Theme Config Editor
function ThemeConfigEditor({ config, onChange }: { config: ThemeConfig, onChange: (config: ThemeConfig) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <input
              type="color"
              value={config.colors.primary}
              onChange={(e) => onChange({
                ...config, 
                colors: {...config.colors, primary: e.target.value}
              })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <input
              type="color"
              value={config.colors.secondary}
              onChange={(e) => onChange({
                ...config, 
                colors: {...config.colors, secondary: e.target.value}
              })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
            <input
              type="color"
              value={config.colors.accent}
              onChange={(e) => onChange({
                ...config, 
                colors: {...config.colors, accent: e.target.value}
              })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Development Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="debug"
              checked={config.development.debug}
              onChange={(e) => onChange({
                ...config, 
                development: {...config.development, debug: e.target.checked}
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="debug" className="ml-2 block text-sm text-gray-900">
              Debug Mode
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="analytics"
              checked={config.development.analytics}
              onChange={(e) => onChange({
                ...config, 
                development: {...config.development, analytics: e.target.checked}
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="analytics" className="ml-2 block text-sm text-gray-900">
              Analytics Enabled
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tracking"
              checked={config.development.tracking}
              onChange={(e) => onChange({
                ...config, 
                development: {...config.development, tracking: e.target.checked}
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="tracking" className="ml-2 block text-sm text-gray-900">
              Tracking Enabled
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// SEO Config Editor
function SEOConfigEditor({ config, onChange }: { config: SEOConfig, onChange: (config: SEOConfig) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
        <input
          type="text"
          value={config.meta.title}
          onChange={(e) => onChange({
            ...config, 
            meta: {...config.meta, title: e.target.value}
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
        <textarea
          value={config.meta.description}
          onChange={(e) => onChange({
            ...config, 
            meta: {...config.meta, description: e.target.value}
          })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
        <input
          type="text"
          value={config.meta.keywords}
          onChange={(e) => onChange({
            ...config, 
            meta: {...config.meta, keywords: e.target.value}
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

// Email Config Editor
function EmailConfigEditor({ config, onChange }: { config: EmailConfig, onChange: (config: EmailConfig) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Sender Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
            <input
              type="text"
              value={config.sender.name}
              onChange={(e) => onChange({
                ...config, 
                sender: {...config.sender, name: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
            <input
              type="email"
              value={config.sender.email}
              onChange={(e) => onChange({
                ...config, 
                sender: {...config.sender, email: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Email Subject</label>
        <input
          type="text"
          value={config.templates.welcome.subject}
          onChange={(e) => onChange({
            ...config, 
            templates: {
              ...config.templates, 
              welcome: {...config.templates.welcome, subject: e.target.value}
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
