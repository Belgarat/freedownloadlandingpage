'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { useEmailTemplates } from '@/lib/useEmailTemplates'
import EmailTemplateEditor from '@/components/EmailTemplateEditor'
import type { EmailTemplateFormData } from '@/types/email-templates'

export default function NewEmailTemplatePage() {
  const router = useRouter()
  const { createTemplate, categories, loading } = useEmailTemplates()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
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

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.html_content) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const template = await createTemplate(formData)
      if (template) {
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
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Template'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="e.g., Welcome Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="e.g., Welcome to our platform!"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Brief description of this template"
                />
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

              {/* Template Editor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Content *
                </label>
                <EmailTemplateEditor
                  value={formData.html_content}
                  onChange={(html) => setFormData(prev => ({ ...prev, html_content: html }))}
                  onTextChange={(text) => setFormData(prev => ({ ...prev, text_content: text }))}
                  showPreview={showPreview}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
