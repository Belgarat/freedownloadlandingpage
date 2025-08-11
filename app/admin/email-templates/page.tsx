'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Mail, ArrowLeft } from 'lucide-react'
import { useEmailTemplates } from '@/lib/useEmailTemplates'
import AdminProtected from '@/components/admin/AdminProtected'
import type { EmailTemplate } from '@/types/email-templates'

export default function EmailTemplatesPage() {
  const router = useRouter()
  const { templates, categories, loading, error, deleteTemplate } = useEmailTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleCreateTemplate = () => {
    router.push('/admin/email-templates/new')
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    router.push(`/admin/email-templates/${template.id}/edit`)
  }

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      const success = await deleteTemplate(template.id)
      if (success) {
        // Template will be removed from the list automatically
      }
    }
  }

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const getCategoryNames = (template: EmailTemplate) => {
    return template.categories?.map(c => c.name).join(', ') || 'No categories'
  }

  if (loading) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading email templates...</p>
          </div>
        </div>
      </AdminProtected>
    )
  }

  if (error) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Admin</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
                  <p className="text-sm text-gray-600">Create and manage email templates</p>
                </div>
              </div>
              <button
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Templates</dt>
                        <dd className="text-lg font-medium text-gray-900">{templates.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Default Templates</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {templates.filter(t => t.is_default).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                        <dd className="text-lg font-medium text-gray-900">{categories.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Placeholders</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {templates.reduce((acc, t) => acc + (t.placeholders?.length || 0), 0)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Templates List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Email Templates</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage your email templates and their placeholders
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {templates.length === 0 ? (
                  <li className="px-4 py-8 text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new email template.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCreateTemplate}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        New Template
                      </button>
                    </div>
                  </li>
                ) : (
                  templates.map((template) => (
                    <li key={template.id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Mail className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                              {template.is_default && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{template.subject}</p>
                            <p className="text-sm text-gray-400">
                              Categories: {getCategoryNames(template)} • 
                              Placeholders: {template.placeholders?.length || 0}
                            </p>
                            <p className="text-xs text-gray-400">
                              Created: {new Date(template.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreviewTemplate(template)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Delete"
                            disabled={template.is_default}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Preview: {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">Subject:</h4>
                <p className="text-sm text-gray-900">{selectedTemplate.subject}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">HTML Content:</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                    {selectedTemplate.html_content}
                  </pre>
                </div>
              </div>
              {selectedTemplate.text_content && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Text Content:</h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      {selectedTemplate.text_content}
                    </pre>
                  </div>
                </div>
              )}
              {selectedTemplate.placeholders && selectedTemplate.placeholders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Placeholders:</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {selectedTemplate.placeholders.map((placeholder) => (
                      <div key={placeholder.id} className="p-2 bg-blue-50 rounded text-xs">
                        <span className="font-medium">{{{placeholder.placeholder_key}}}</span>
                        <span className="text-gray-600"> - {placeholder.placeholder_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminProtected>
  )
}
