'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, EyeOff, Palette, Undo2 } from 'lucide-react'
import type { EmailThemeCategory, ThemeStyles } from '@/types/email-themes'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface ThemeFormData {
  name: string
  description: string
  category_id?: number
  is_custom: boolean
  properties: Partial<ThemeStyles>
}

const defaultThemeStyles: ThemeStyles = {
  primary_color: '#2563eb',
  secondary_color: '#64748b',
  background_color: '#ffffff',
  text_color: '#1f2937',
  font_family: 'Arial, sans-serif',
  border_radius: '8px',
  header_style: {
    background: '#2563eb',
    color: '#ffffff',
    padding: '20px',
    'text-align': 'center'
  },
  footer_style: {
    background: '#f8fafc',
    color: '#64748b',
    padding: '15px',
    'text-align': 'center',
    'font-size': '12px'
  },
  button_style: {
    background: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    'border-radius': '6px',
    'text-decoration': 'none',
    display: 'inline-block'
  }
}

export default function NewThemePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<EmailThemeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [formData, setFormData] = useState<ThemeFormData>({
    name: '',
    description: '',
    category_id: undefined,
    is_custom: true,
    properties: { ...defaultThemeStyles }
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/email-templates/themes/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (field: keyof ThemeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePropertyChange = (property: keyof ThemeStyles, value: any) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [property]: value
      }
    }))
  }

  const handleStyleChange = (styleType: 'header_style' | 'footer_style' | 'button_style', property: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [styleType]: {
          ...prev.properties[styleType],
          [property]: value
        }
      }
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a theme name')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/email-templates/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/email-templates/themes')
      } else {
        const error = await response.json()
        alert(`Error creating theme: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      alert('Error saving theme')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      category_id: undefined,
      is_custom: true,
      properties: { ...defaultThemeStyles }
    })
  }

  const handleBack = () => {
    router.push('/admin/email-templates/themes')
  }

  // Generate preview HTML
  const generatePreviewHTML = () => {
    const styles = formData.properties
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Preview</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: ${styles.font_family || 'Arial, sans-serif'};
            background-color: ${styles.background_color || '#ffffff'};
            color: ${styles.text_color || '#1f2937'};
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: ${styles.background_color || '#ffffff'};
            border-radius: ${styles.border_radius || '8px'};
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: ${styles.header_style?.background || styles.primary_color || '#2563eb'};
            color: ${styles.header_style?.color || '#ffffff'};
            padding: ${styles.header_style?.padding || '20px'};
            text-align: ${styles.header_style?.['text-align'] || 'center'};
          }
          .content {
            padding: 30px;
            line-height: 1.6;
          }
          .button {
            background: ${styles.button_style?.background || styles.primary_color || '#2563eb'};
            color: ${styles.button_style?.color || '#ffffff'};
            padding: ${styles.button_style?.padding || '12px 24px'};
            border-radius: ${styles.button_style?.['border-radius'] || '6px'};
            text-decoration: ${styles.button_style?.['text-decoration'] || 'none'};
            display: ${styles.button_style?.display || 'inline-block'};
            margin: 20px 0;
          }
          .footer {
            background: ${styles.footer_style?.background || '#f8fafc'};
            color: ${styles.footer_style?.color || styles.secondary_color || '#64748b'};
            padding: ${styles.footer_style?.padding || '15px'};
            text-align: ${styles.footer_style?.['text-align'] || 'center'};
            font-size: ${styles.footer_style?.['font-size'] || '12px'};
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Your Company Name</h1>
            <p>Professional Email Template</p>
          </div>
          <div class="content">
            <h2>Welcome to our newsletter!</h2>
            <p>This is a preview of how your email will look with the selected theme. You can customize colors, fonts, and styling to match your brand.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <a href="#" class="button">Call to Action</a>
            <p>Thank you for reading our newsletter!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
            <p>You received this email because you signed up for our newsletter.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading theme editor...</p>
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Themes</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Theme</h1>
                <p className="text-sm text-gray-600">Design and customize your email theme</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Undo2 className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Theme'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Editor */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter theme name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your theme"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => handleInputChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Color Scheme</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.properties.primary_color || '#2563eb'}
                      onChange={(e) => handlePropertyChange('primary_color', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.properties.primary_color || '#2563eb'}
                      onChange={(e) => handlePropertyChange('primary_color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.properties.secondary_color || '#64748b'}
                      onChange={(e) => handlePropertyChange('secondary_color', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.properties.secondary_color || '#64748b'}
                      onChange={(e) => handlePropertyChange('secondary_color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.properties.background_color || '#ffffff'}
                      onChange={(e) => handlePropertyChange('background_color', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.properties.background_color || '#ffffff'}
                      onChange={(e) => handlePropertyChange('background_color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.properties.text_color || '#1f2937'}
                      onChange={(e) => handlePropertyChange('text_color', e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.properties.text_color || '#1f2937'}
                      onChange={(e) => handlePropertyChange('text_color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Typography</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={formData.properties.font_family || 'Arial, sans-serif'}
                    onChange={(e) => handlePropertyChange('font_family', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, Arial, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="system-ui, -apple-system, sans-serif">System UI</option>
                    <option value="Inter, system-ui, sans-serif">Inter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={formData.properties.border_radius || '8px'}
                    onChange={(e) => handlePropertyChange('border_radius', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="8px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatePreviewHTML()}
                  className="w-full h-96 border-0"
                  title="Theme Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
