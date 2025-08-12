'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Copy, Trash2, Palette, Eye, Mail } from 'lucide-react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import type { EmailTheme } from '@/types/email-themes'

export default function ThemeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [theme, setTheme] = useState<EmailTheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchTheme()
  }, [params.id])

  const fetchTheme = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/email-templates/themes/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Theme not found')
        } else {
          setError('Failed to fetch theme')
        }
        return
      }

      const themeData = await response.json()
      setTheme(themeData)
    } catch (err) {
      setError('Failed to fetch theme')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/email-templates/themes/${params.id}/edit`)
  }

  const handleDuplicate = async () => {
    if (!theme) return

    try {
      const response = await fetch('/api/email-templates/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${theme.name} (Copy)`,
          description: theme.description,
          category_id: theme.category_id,
          properties: theme.properties.reduce((acc, prop) => {
            acc[prop.property_key] = prop.property_value
            return acc
          }, {} as Record<string, string>)
        })
      })

      if (response.ok) {
        const newTheme = await response.json()
        router.push(`/admin/email-templates/themes/${newTheme.id}/edit`)
      }
    } catch (err) {
      console.error('Failed to duplicate theme:', err)
    }
  }

  const handleDelete = async () => {
    if (!theme) return

    try {
      const response = await fetch(`/api/email-templates/themes/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/email-templates/themes')
      }
    } catch (err) {
      console.error('Failed to delete theme:', err)
    }
  }

  const getPropertyValue = (key: string) => {
    return theme?.properties?.find(p => p.property_key === key)?.property_value || 'N/A'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading theme...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !theme) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600">Error: {error || 'Theme not found'}</p>
            <button 
              onClick={() => router.push('/admin/email-templates/themes')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Themes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/email-templates/themes')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{theme.name}</h1>
                <p className="text-sm text-gray-500">Theme Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              {!theme.is_default && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Theme Information</h2>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{theme.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{theme.category?.name || 'Uncategorized'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{theme.description || 'No description'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1">
                      {theme.is_default ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Custom
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(theme.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Theme Properties */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Theme Properties</h2>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Colors</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs text-gray-500">Primary Color</dt>
                        <dd className="mt-1 flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: getPropertyValue('primary_color') }}
                          ></div>
                          <span className="text-sm font-mono">{getPropertyValue('primary_color')}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Secondary Color</dt>
                        <dd className="mt-1 flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: getPropertyValue('secondary_color') }}
                          ></div>
                          <span className="text-sm font-mono">{getPropertyValue('secondary_color')}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Background Color</dt>
                        <dd className="mt-1 flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: getPropertyValue('background_color') }}
                          ></div>
                          <span className="text-sm font-mono">{getPropertyValue('background_color')}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Text Color</dt>
                        <dd className="mt-1 flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: getPropertyValue('text_color') }}
                          ></div>
                          <span className="text-sm font-mono">{getPropertyValue('text_color')}</span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Typography & Layout</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs text-gray-500">Font Family</dt>
                        <dd className="mt-1 text-sm font-mono">{getPropertyValue('font_family')}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Border Radius</dt>
                        <dd className="mt-1 text-sm font-mono">{getPropertyValue('border_radius')}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Theme Preview */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Theme Preview</h3>
              </div>
              <div className="p-6">
                <div 
                  className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  style={{ 
                    backgroundColor: getPropertyValue('background_color'),
                    color: getPropertyValue('text_color'),
                    fontFamily: getPropertyValue('font_family'),
                    borderRadius: getPropertyValue('border_radius')
                  }}
                >
                  <div className="text-center">
                    <Palette className="h-8 w-8 mx-auto mb-2" style={{ color: getPropertyValue('primary_color') }} />
                    <p className="text-sm font-medium">{theme.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => router.push('/admin/email-templates')}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  View Templates
                </button>
                <button
                  onClick={() => router.push('/admin/email-templates/themes')}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  All Themes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Theme</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{theme.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
