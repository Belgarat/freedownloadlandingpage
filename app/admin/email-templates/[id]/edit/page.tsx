'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmailTemplates } from '@/lib/useEmailTemplates';
import EmailTemplateEditor from '@/components/EmailTemplateEditor';

interface EditEmailTemplatePageProps {
  params: {
    id: string;
  };
}

export default function EditEmailTemplatePage({ params }: EditEmailTemplatePageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);
  const { 
    templates, 
    categories, 
    placeholders, 
    updateTemplate, 
    isLoading, 
    error 
  } = useEmailTemplates();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    is_default: false,
    category_ids: [] as number[]
  });
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Find the template to edit
  const template = templates.find(t => t.id === parseInt(id || '0'));

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        description: template.description || '',
        is_default: template.is_default,
        category_ids: template.categories?.map(c => c.id) || []
      });
      setHtmlContent(template.html_content);
      setTextContent(template.text_content || '');
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      await updateTemplate(template.id, {
        ...formData,
        html_content: htmlContent,
        text_content: textContent
      });
      router.push('/admin/email-templates');
    } catch (error) {
      console.error('Error updating template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/email-templates');
  };

  if (isLoading || !id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800">Error loading template</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800">Template not found</h3>
            <p className="mt-1 text-sm text-yellow-700">The template you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Email Template</h1>
              <p className="mt-1 text-sm text-gray-600">
                Update the email template "{template.name}"
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can use placeholders like {'{{userName}}'}, {'{{downloadUrl}}'}, {'{{bookTitle}}'} in the subject line.
                  </p>
                  {placeholders && placeholders.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Quick insert placeholders:</p>
                      <div className="flex flex-wrap gap-1">
                        {placeholders.slice(0, 5).map(placeholder => (
                          <button
                            key={placeholder.id}
                            type="button"
                            onClick={() => {
                              const subjectInput = document.getElementById('subject') as HTMLInputElement;
                              if (subjectInput) {
                                const placeholderText = `{{${placeholder.placeholder_key}}}`;
                                const cursorPos = subjectInput.selectionStart || 0;
                                const currentValue = subjectInput.value;
                                const newValue = currentValue.slice(0, cursorPos) + placeholderText + currentValue.slice(cursorPos);
                                setFormData(prev => ({ ...prev, subject: newValue }));
                                
                                // Set cursor position after placeholder
                                setTimeout(() => {
                                  subjectInput.focus();
                                  subjectInput.setSelectionRange(cursorPos + placeholderText.length, cursorPos + placeholderText.length);
                                }, 0);
                              }
                            }}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                          >
                            {placeholder.placeholder_key}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                    Set as default template
                  </label>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              
              <div className="space-y-3">
                {categories && categories.length > 0 ? (
                  categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.category_ids.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900">
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            </div>

            {/* Email Content */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Content</h3>
              
              <EmailTemplateEditor
                htmlContent={htmlContent}
                textContent={textContent}
                onHtmlChange={setHtmlContent}
                onTextChange={setTextContent}
                showPreview={showPreview}
                onShowPreviewChange={setShowPreview}
                onTextChange={(text) => setTextContent(text)}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  onClick={handleCancel}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Available Placeholders */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Placeholders</h3>
              
              <div className="space-y-2">
                {placeholders && placeholders.length > 0 ? (
                  placeholders.map(placeholder => (
                    <div key={placeholder.id} className="text-sm">
                      <span className="font-medium text-gray-900">{placeholder.placeholder_key}</span>
                      <p className="text-gray-600 text-xs mt-1">{placeholder.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No placeholders available</p>
                )}
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Template Info</h3>
              
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">ID:</dt>
                  <dd className="text-gray-900">{template.id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Created:</dt>
                  <dd className="text-gray-900">
                    {new Date(template.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Updated:</dt>
                  <dd className="text-gray-900">
                    {new Date(template.updated_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Status:</dt>
                  <dd className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.is_default 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.is_default ? 'Default' : 'Active'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
