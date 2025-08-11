'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Palette, Edit, Trash2, Eye, Copy, Filter, Search } from 'lucide-react'
import type { EmailTheme, EmailThemeCategory } from '@/types/email-themes'

interface ThemeWithUsage extends EmailTheme {
  usage_count: number
}

export default function EmailThemesPage() {
  const router = useRouter()
  const [themes, setThemes] = useState<ThemeWithUsage[]>([])
  const [categories, setCategories] = useState<EmailThemeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [showPreview, setShowPreview] = useState<number | null>(null)

  // Fetch themes and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [themesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/email-templates/themes'),
          fetch('/api/email-templates/themes/categories')
        ])

        if (themesResponse.ok && categoriesResponse.ok) {
          const themesData = await themesResponse.json()
          const categoriesData = await categoriesResponse.json()
          
          // Add usage count (simulated for now)
          const themesWithUsage = themesData.map((theme: EmailTheme) => ({
            ...theme,
            usage_count: Math.floor(Math.random() * 10) // Simulated usage count
          }))
          
          setThemes(themesWithUsage)
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching themes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter themes
  const filteredThemes = themes.filter(theme => {
    const matchesSearch = searchTerm === '' || 
      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || 
      theme.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCreateTheme = () => {
    router.push('/admin/email-templates/themes/new')
  }

  const handleEditTheme = (themeId: number) => {
    router.push(`/admin/email-templates/themes/${themeId}/edit`)
  }

  const handleDuplicateTheme = async (theme: EmailTheme) => {
    try {
      const response = await fetch('/api/email-templates/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${theme.name} (Copy)`,
          description: theme.description ? `${theme.description} (Copy)` : 'Duplicated theme',
          category_id: theme.category_id,
          is_custom: true,
          properties: theme.properties?.reduce((acc, prop) => {
            acc[prop.property_key] = prop.property_value
            return acc
          }, {} as Record<string, string>)
        })
      })

      if (response.ok) {
        // Refresh themes
        window.location.reload()
      }
    } catch (error) {
      console.error('Error duplicating theme:', error)
    }
  }

  const handleDeleteTheme = async (themeId: number) => {
    if (!confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/email-templates/themes/${themeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setThemes(prev => prev.filter(t => t.id !== themeId))
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
    }
  }

  const handleBack = () => {
    router.push('/admin/email-templates')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading themes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Templates</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Themes</h1>
                <p className="text-sm text-gray-600">Manage and customize email themes</p>
              </div>
            </div>
            <button
              onClick={handleCreateTheme}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Theme</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Themes
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by name or description..."
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <p className="text-sm text-gray-600">
                  Showing {filteredThemes.length} of {themes.length} themes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Palette className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No themes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new theme.'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateTheme}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Theme
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredThemes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Theme Preview */}
                <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="h-8 w-8 text-gray-400" />
                  </div>
                  {theme.is_default && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    </div>
                  )}
                  {theme.is_custom && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Custom
                      </span>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {theme.description || 'No description'}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>{theme.category?.name || 'Uncategorized'}</span>
                        <span>{theme.usage_count} templates</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPreview(showPreview === theme.id ? null : theme.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!theme.is_default && (
                        <>
                          <button
                            onClick={() => handleEditTheme(theme.id)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateTheme(theme)}
                            className="p-2 text-gray-400 hover:text-green-600"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/admin/email-templates/themes/${theme.id}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Theme Preview Modal */}
                {showPreview === theme.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Theme Preview</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Primary Color: <span className="font-mono">{theme.properties?.find(p => p.property_key === 'primary_color')?.property_value || 'N/A'}</span></div>
                      <div>Font Family: <span className="font-mono">{theme.properties?.find(p => p.property_key === 'font_family')?.property_value || 'N/A'}</span></div>
                      <div>Border Radius: <span className="font-mono">{theme.properties?.find(p => p.property_key === 'border_radius')?.property_value || 'N/A'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
