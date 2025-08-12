'use client'

import { useState, useEffect } from 'react'
import { Palette, Check, Eye } from 'lucide-react'
import type { EmailTheme, EmailTemplateTheme } from '@/types/email-themes'

interface ThemeSelectorProps {
  templateId: number
  onThemeChange?: (theme: EmailTheme) => void
  className?: string
  allowSelection?: boolean
}

export default function ThemeSelector({ templateId, onThemeChange, className = '', allowSelection = true }: ThemeSelectorProps) {
  const [themes, setThemes] = useState<EmailTheme[]>([])
  const [currentTheme, setCurrentTheme] = useState<EmailTemplateTheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState<number | null>(null)
  const [assigning, setAssigning] = useState(false)

  // Fetch themes and current theme
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const themesResponse = await fetch('/api/email-templates/themes')
        
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }

        // Only fetch current theme if template exists
        if (templateId > 0) {
          const currentThemeResponse = await fetch(`/api/email-templates/themes/assign?template_id=${templateId}`)
          if (currentThemeResponse.ok) {
            const currentThemeData = await currentThemeResponse.json()
            setCurrentTheme(currentThemeData)
          }
        }
      } catch (error) {
        console.error('Error fetching theme data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [templateId])

  const handleThemeSelect = async (theme: EmailTheme) => {
    if (!allowSelection) {
      onThemeChange?.(theme)
      return
    }

    setAssigning(true)
    try {
      const response = await fetch('/api/email-templates/themes/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          theme_id: theme.id
        })
      })

      if (response.ok) {
        const assignment = await response.json()
        setCurrentTheme(assignment)
        onThemeChange?.(theme)
      } else {
        const error = await response.json()
        alert(`Error assigning theme: ${error.error}`)
      }
    } catch (error) {
      console.error('Error assigning theme:', error)
      alert('Error assigning theme')
    } finally {
      setAssigning(false)
    }
  }

  const generateThemePreview = (theme: EmailTheme) => {
    const styles = theme.properties?.reduce((acc: any, prop: any) => {
      if (prop.property_type === 'json') {
        try {
          acc[prop.property_key] = JSON.parse(prop.property_value)
        } catch {
          acc[prop.property_key] = prop.property_value
        }
      } else {
        acc[prop.property_key] = prop.property_value
      }
      return acc
    }, {}) || {}

    return `
      <div style="
        font-family: ${styles.font_family || 'Arial, sans-serif'};
        background: ${styles.background_color || '#ffffff'};
        color: ${styles.text_color || '#1f2937'};
        border-radius: ${styles.border_radius || '8px'};
        padding: 8px;
        font-size: 10px;
        border: 1px solid #e5e7eb;
      ">
        <div style="
          background: ${styles.primary_color || '#2563eb'};
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          text-align: center;
        ">Header</div>
        <div style="
          background: ${styles.button_style?.background || styles.primary_color || '#2563eb'};
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 3px;
          text-align: center;
          font-size: 8px;
        ">Button</div>
      </div>
    `
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Theme
      </label>
      
      <div className="space-y-2">
        {themes.map((theme) => {
          const isSelected = currentTheme?.theme_id === theme.id
          const isDefault = theme.is_default
          
          return (
            <div
              key={theme.id}
              className={`
                relative p-3 border rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${assigning ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={() => handleThemeSelect(theme)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: theme.properties?.find(p => p.property_key === 'primary_color')?.property_value || '#2563eb' }}
                    >
                      <Palette className="w-4 h-4 text-white m-1" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {theme.name}
                      </p>
                      {isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                      {theme.is_custom && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {theme.description || 'No description'}
                    </p>
                    {theme.category && (
                      <p className="text-xs text-gray-400">
                        {theme.category.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowPreview(showPreview === theme.id ? null : theme.id)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Preview theme"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Theme Preview */}
              {showPreview === theme.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <div 
                    className="w-full max-w-xs"
                    dangerouslySetInnerHTML={{ __html: generateThemePreview(theme) }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Palette className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm">No themes available</p>
        </div>
      )}
    </div>
  )
}
