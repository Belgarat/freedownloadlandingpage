'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus } from 'lucide-react'
import { useEmailTemplates } from '@/lib/useEmailTemplates'
import EmailTemplateEditor from '@/components/EmailTemplateEditor'
import ThemeSelector from '@/components/ThemeSelector'
import type { EmailTemplateFormData } from '@/types/email-templates'

export default function NewEmailTemplatePage() {
  const router = useRouter()
  const { createTemplate, categories, loading } = useEmailTemplates()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    description: '',
    is_default: false,
    placeholders: [],
    category_ids: []
  })
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null)

  const handleSave = async () => {
    // Mark all fields as touched to show all errors
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    // Validate form
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const template = await createTemplate(formData)
      if (template) {
        // Assign theme if selected
        if (selectedThemeId) {
          try {
            await fetch('/api/email-templates/themes/assign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                template_id: template.id,
                theme_id: selectedThemeId
              })
            })
          } catch (error) {
            console.error('Error assigning theme:', error)
            // Don't fail the save if theme assignment fails
          }
        }
        router.push('/admin/email-templates')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/email-templates')
  }

  // Validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Template name is required'
        }
        if (value.length < 3) {
          return 'Template name must be at least 3 characters'
        }
        if (value.length > 100) {
          return 'Template name must be less than 100 characters'
        }
        return ''
      
      case 'subject':
        if (!value || value.trim() === '') {
          return 'Subject line is required'
        }
        if (value.length < 5) {
          return 'Subject line must be at least 5 characters'
        }
        if (value.length > 200) {
          return 'Subject line must be less than 200 characters'
        }
        return ''
      
      case 'html_content':
        if (!value || value.trim() === '') {
          return 'HTML content is required'
        }
        if (value.length < 10) {
          return 'HTML content must be at least 10 characters'
        }
        // Basic HTML validation
        if (!value.includes('<') || !value.includes('>')) {
          return 'HTML content must contain valid HTML tags'
        }
        return ''
      
      case 'description':
        if (value && value.length > 500) {
          return 'Description must be less than 500 characters'
        }
        return ''
      
      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof EmailTemplateFormData])
      if (error) {
        newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate field if it has been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({
        ...prev,
        [field]: error
      }))
    }
  }

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof EmailTemplateFormData])
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Templates</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">New Email Template</h1>
                <p className="text-sm text-gray-600">Create a new email template</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving || Object.keys(errors).length > 0}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Template'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div>
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.name && touched.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Welcome Email"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    onBlur={() => handleFieldBlur('subject')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.subject && touched.subject 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Welcome to our platform!"
                  />
                  {errors.subject && touched.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                    errors.description && touched.description 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Brief description of this template"
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {(formData.description || '').length}/500 characters
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set as default template</span>
                </label>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.category_ids?.includes(category.id)}
                          onChange={(e) => {
                            const categoryIds = formData.category_ids || []
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                category_ids: [...categoryIds, category.id]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                category_ids: categoryIds.filter(id => id !== category.id)
                              }))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Theme Selection */}
              <div className="mb-6">
                <ThemeSelector
                  templateId={0} // Will be set after template creation
                  onThemeChange={(theme) => setSelectedThemeId(theme.id)}
                  className="max-w-md"
                  allowSelection={false}
                />
              </div>

              {/* Template Editor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Content *
                </label>
                <EmailTemplateEditor
                  value={formData.html_content}
                  onChange={(html) => handleFieldChange('html_content', html)}
                  onTextChange={(text) => setFormData(prev => ({ ...prev, text_content: text }))}
                  showPreview={showPreview}
                  onShowPreviewChange={setShowPreview}
                />
                {errors.html_content && touched.html_content && (
                  <p className="mt-1 text-sm text-red-600">{errors.html_content}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
