'use client'

import { useState } from 'react'
import { getGenrePreset, GenreType } from '@/lib/genre-presets'
import { GenreService } from '@/lib/genre-service'

interface GenrePreviewProps {
  genre: GenreType
  currentConfig?: any
}

export default function GenrePreview({ genre, currentConfig }: GenrePreviewProps) {
  const [previewConfig, setPreviewConfig] = useState<any>(null)
  const preset = getGenrePreset(genre)

  const generatePreview = () => {
    const config = GenreService.applyGenrePreset(genre, currentConfig)
    setPreviewConfig(config)
  }

  if (!previewConfig) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview {preset.name}</h3>
        <p className="text-gray-600 mb-4">
          See how your landing page will look with the {preset.name} template applied.
        </p>
        <button
          onClick={generatePreview}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Generate Preview
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview: {preset.name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Palette Preview */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Color Palette</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: preset.colorScheme.primary }}
              />
              <span className="text-sm text-gray-600">Primary: {preset.colorScheme.primary}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: preset.colorScheme.secondary }}
              />
              <span className="text-sm text-gray-600">Secondary: {preset.colorScheme.secondary}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: preset.colorScheme.accent }}
              />
              <span className="text-sm text-gray-600">Accent: {preset.colorScheme.accent}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: preset.colorScheme.background }}
              />
              <span className="text-sm text-gray-600">Background: {preset.colorScheme.background}</span>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Typography</h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Heading Font:</p>
              <p className="font-semibold" style={{ fontFamily: preset.fonts.heading }}>
                {preset.fonts.heading}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Body Font:</p>
              <p className="text-sm" style={{ fontFamily: preset.fonts.body }}>
                {preset.fonts.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      {preset.features.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Special Features</h4>
          <div className="flex flex-wrap gap-2">
            {preset.features.map((feature, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {feature.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sample Content Preview */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Sample Content</h4>
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: preset.colorScheme.background,
            color: preset.colorScheme.text
          }}
        >
          <h2 
            className="text-xl font-bold mb-2"
            style={{ 
              fontFamily: preset.fonts.heading,
              color: preset.colorScheme.primary
            }}
          >
            Sample Book Title
          </h2>
          <p 
            className="text-sm mb-3"
            style={{ fontFamily: preset.fonts.body }}
          >
            This is how your book description will appear with the {preset.name} template.
          </p>
          <button
            className="px-4 py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: preset.colorScheme.accent }}
          >
            Get Your Free Copy
          </button>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setPreviewConfig(null)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back to Selection
        </button>
        <button
          onClick={generatePreview}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh Preview
        </button>
      </div>
    </div>
  )
}
