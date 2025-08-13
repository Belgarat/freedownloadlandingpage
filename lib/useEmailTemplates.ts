import { useState, useEffect } from 'react'
import type { EmailTemplate, TemplateCategory, EmailTemplateFormData } from '@/types/email-templates'

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email-templates')
      if (!response.ok) throw new Error('Failed to fetch templates')
      const data = await response.json()
      // Handle both array and object response formats
      const templatesArray = Array.isArray(data) ? data : (data.templates || [])
      setTemplates(templatesArray)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/email-templates/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  // Create template
  const createTemplate = async (templateData: EmailTemplateFormData): Promise<EmailTemplate | null> => {
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      })
      
      if (!response.ok) throw new Error('Failed to create template')
      const template = await response.json()
      setTemplates(prev => [template, ...prev])
      return template
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  // Update template
  const updateTemplate = async (id: number, templateData: EmailTemplateFormData): Promise<EmailTemplate | null> => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      })
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update template: ${response.status} ${errorText}`)
      }
      
      const template = await response.json()
      setTemplates(prev => prev.map(t => t.id === id ? template : t))
      return template
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  // Delete template
  const deleteTemplate = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete template: ${response.status} ${errorText}`)
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  // Duplicate template
  const duplicateTemplate = async (id: number): Promise<EmailTemplate | null> => {
    try {
      const template = templates.find(t => t.id === id)
      if (!template) throw new Error('Template not found')

      const duplicateData: EmailTemplateFormData = {
        name: `${template.name} (Copy)`,
        subject: template.subject,
        description: template.description ? `${template.description} (Copy)` : 'Duplicated template',
        html_content: template.html_content,
        text_content: template.text_content || '',
        is_default: false, // Duplicates are never default
        category_ids: template.categories?.map(c => c.id) || []
      }

      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      })
      
      if (!response.ok) throw new Error('Failed to duplicate template')
      const newTemplate = await response.json()
      setTemplates(prev => [newTemplate, ...prev])
      return newTemplate
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  // Get template by ID
  const getTemplate = (id: number): EmailTemplate | undefined => {
    return templates.find(t => t.id === id)
  }

  // Get default template
  const getDefaultTemplate = (): EmailTemplate | undefined => {
    return templates.find(t => t.is_default)
  }

  // Get templates by category
  const getTemplatesByCategory = (categoryId: number): EmailTemplate[] => {
    return templates.filter(t => 
      t.categories?.some(c => c.id === categoryId)
    )
  }

  // Initialize
  useEffect(() => {
    fetchTemplates()
    fetchCategories()
  }, [])

  return {
    templates,
    categories,
    loading,
    error,
    fetchTemplates,
    fetchCategories,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplate,
    getDefaultTemplate,
    getTemplatesByCategory
  }
}
