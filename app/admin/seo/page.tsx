'use client'

import { useAuth } from '@/lib/auth'
import { useConfig } from '@/lib/useConfig'
import { useState } from 'react'

export default function SEOPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const { seoConfig, saveConfig } = useConfig()
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
    if (!seoConfig) return
    
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      await saveConfig('seo', seoConfig)
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
            <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
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

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Meta Tags</h2>
              <p className="text-gray-600 mb-6">
                Configure basic meta tags for search engines.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={seoConfig?.meta.title || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, title: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your Book Title - Free Download"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={seoConfig?.meta.description || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, description: e.target.value }
                        })
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Download your free copy of our amazing book..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={seoConfig?.meta.keywords || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, keywords: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ebook, free download, book, reading"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={seoConfig?.meta.author || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, author: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Author Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                  <input
                    type="text"
                    value={seoConfig?.meta.robots || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, robots: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="index, follow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={seoConfig?.meta.canonical || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          meta: { ...seoConfig.meta, canonical: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Open Graph</h2>
              <p className="text-gray-600 mb-6">
                Configure how your page appears when shared on social media.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                  <input
                    type="text"
                    value={seoConfig?.openGraph.title || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, title: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your Book Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                  <textarea
                    value={seoConfig?.openGraph.description || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, description: e.target.value }
                        })
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Download your free copy..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
                  <input
                    type="text"
                    value={seoConfig?.openGraph.type || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, type: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG URL</label>
                  <input
                    type="url"
                    value={seoConfig?.openGraph.url || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, url: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                  <input
                    type="url"
                    value={seoConfig?.openGraph.image || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, image: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://yoursite.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={seoConfig?.openGraph.siteName || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          openGraph: { ...seoConfig.openGraph, siteName: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your Site Name"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Twitter Cards</h2>
              <p className="text-gray-600 mb-6">
                Configure Twitter-specific meta tags.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                  <select
                    value={seoConfig?.twitter.card || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          twitter: { ...seoConfig.twitter, card: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select card type</option>
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Title</label>
                  <input
                    type="text"
                    value={seoConfig?.twitter.title || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          twitter: { ...seoConfig.twitter, title: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Your Book Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Description</label>
                  <textarea
                    value={seoConfig?.twitter.description || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          twitter: { ...seoConfig.twitter, description: e.target.value }
                        })
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Download your free copy..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image</label>
                  <input
                    type="url"
                    value={seoConfig?.twitter.image || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          twitter: { ...seoConfig.twitter, image: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://yoursite.com/twitter-image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sitemap Settings</h2>
              <p className="text-gray-600 mb-6">
                Configure sitemap generation settings.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sitemapEnabled"
                    checked={seoConfig?.sitemap.enabled || false}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          sitemap: { ...seoConfig.sitemap, enabled: e.target.checked }
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">
                    Enable Sitemap Generation
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={seoConfig?.sitemap.priority || 1}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          sitemap: { ...seoConfig.sitemap, priority: parseFloat(e.target.value) }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
                  <select
                    value={seoConfig?.sitemap.changefreq || ''}
                    onChange={(e) => {
                      if (seoConfig) {
                        saveConfig('seo', {
                          ...seoConfig,
                          sitemap: { ...seoConfig.sitemap, changefreq: e.target.value }
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
