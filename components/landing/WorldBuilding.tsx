'use client'

import { useState } from 'react'

interface WorldBuildingSection {
  id: string
  title: string
  content: string
  type: 'setting' | 'magic' | 'technology' | 'culture' | 'history'
  icon?: string
}

interface WorldBuildingProps {
  sections?: WorldBuildingSection[]
  title?: string
  className?: string
}

export default function WorldBuilding({ sections, title = 'World Building', className = '' }: WorldBuildingProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  if (!sections || sections.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">No world building content available</p>
      </div>
    )
  }

  const getSectionIcon = (type: string) => {
    const icons = {
      setting: '🏰',
      magic: '✨',
      technology: '⚡',
      culture: '👥',
      history: '📜'
    }
    return icons[type as keyof typeof icons] || '🌍'
  }

  const getSectionColor = (type: string) => {
    const colors = {
      setting: 'bg-blue-100 text-blue-800',
      magic: 'bg-purple-100 text-purple-800',
      technology: 'bg-green-100 text-green-800',
      culture: 'bg-orange-100 text-orange-800',
      history: 'bg-red-100 text-red-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getSectionColor(section.type)}`}>
                  {section.icon || getSectionIcon(section.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getSectionColor(section.type)}`}>
                    {section.type}
                  </span>
                  
                  {/* Preview content */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {section.content.length > 100 
                      ? `${section.content.substring(0, 100)}...` 
                      : section.content
                    }
                  </p>
                </div>
              </div>
              
              {/* Expanded content */}
              {selectedSection === section.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
