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
      setTemplates(data)
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
      
      if (!response.ok) throw new Error('Failed to update template')
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
      
      if (!response.ok) throw new Error('Failed to delete template')
      setTemplates(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
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
    getTemplate,
    getDefaultTemplate,
    getTemplatesByCategory
  }
}
