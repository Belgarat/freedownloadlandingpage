'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'

interface PlaceholderLegendProps {
  className?: string
}

const placeholders = [
  {
    placeholder: '{{downloadUrl}}',
    description: 'Link di download del libro',
    example: 'https://example.com/download/abc123'
  },
  {
    placeholder: '{{name}}',
    description: 'Nome dell\'utente',
    example: 'Marco'
  },
  {
    placeholder: '{{bookTitle}}',
    description: 'Titolo del libro',
    example: 'Fish Cannot Carry Guns'
  },
  {
    placeholder: '{{authorName}}',
    description: 'Nome dell\'autore',
    example: 'Michael B. Morgan'
  },
  {
    placeholder: '{{goodreadsUrl}}',
    description: 'URL della pagina Goodreads',
    example: 'https://goodreads.com/book/show/123'
  },
  {
    placeholder: '{{amazonUrl}}',
    description: 'URL della pagina Amazon',
    example: 'https://amazon.com/dp/B0DS55TQ8R'
  },
  {
    placeholder: '{{substackUrl}}',
    description: 'URL del Substack',
    example: 'https://aroundscifi.substack.com/'
  },
  {
    placeholder: '{{publisherUrl}}',
    description: 'URL del publisher',
    example: 'https://37indielab.com'
  },
  {
    placeholder: '{{publisherName}}',
    description: 'Nome del publisher',
    example: '3/7 Indie Lab'
  },
  {
    placeholder: '{{substackName}}',
    description: 'Nome del Substack',
    example: 'Around Sci-Fi'
  }
]

export default function PlaceholderLegend({ className = '' }: PlaceholderLegendProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
      >
        <Info className="w-4 h-4" />
        Placeholders Disponibili
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Placeholders Disponibili</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {placeholders.map((item) => (
              <div key={item.placeholder} className="p-2 bg-gray-50 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs font-mono bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                    {item.placeholder}
                  </code>
                </div>
                <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                <p className="text-xs text-gray-500">
                  Esempio: <span className="font-mono">{item.example}</span>
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 I placeholders vengono sostituiti automaticamente con i valori dalla configurazione del libro.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
