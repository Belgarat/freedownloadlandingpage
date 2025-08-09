'use client'

import { useState } from 'react'
import { BookConfig } from '@/lib/config-loader'
import WYSIWYGEditor from '@/components/WYSIWYGEditor'
import CoverUploader from '@/components/admin/CoverUploader'
import TagInput from '@/components/admin/TagInput'

interface BookConfigEditorProps {
  config: BookConfig
  onChange: (config: BookConfig) => void
}

export default function BookConfigEditor({ config, onChange }: BookConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'base' | 'content' | 'publisher' | 'links' | 'metadata' | 'pricing' | 'categories'>('base')

  const tabs = [
    { id: 'base', label: 'Base' },
    { id: 'content', label: 'Contenuti' },
    { id: 'publisher', label: 'Editore' },
    { id: 'links', label: 'Link' },
    { id: 'metadata', label: 'Metadata' },
    { id: 'pricing', label: 'Prezzo' },
    { id: 'categories', label: 'Categorie' }
  ] as const

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Configurazione Libro</h3>
        <p className="text-sm text-blue-700 mt-1">Organizzato in sezioni per semplificare la compilazione.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'base' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titolo del libro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sottotitolo</label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sottotitolo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autore</label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => onChange({ ...config, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome autore"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Immagine di copertina</label>
              <CoverUploader
                value={config.coverImage}
                onUploaded={(url) => {
                  // Expose globally for theme generation button
                  if (typeof window !== 'undefined') { (window as any).__currentCoverUrl = url }
                  onChange({ ...config, coverImage: url })
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
            <WYSIWYGEditor
              value={config.description}
              onChange={(value) => onChange({ ...config, description: value })}
              placeholder="Scrivi la descrizione del libro..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio Autore</label>
            <WYSIWYGEditor
              value={config.authorBio}
              onChange={(value) => onChange({ ...config, authorBio: value })}
              placeholder="Scrivi la bio dell'autore..."
            />
          </div>
        </div>
      )}

      {activeTab === 'publisher' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Editore (Publisher)</label>
              <input
                type="text"
                value={config.publisher}
                onChange={(e) => onChange({ ...config, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome editore"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Editore</label>
              <input
                type="url"
                value={config.publisherUrl}
                onChange={(e) => onChange({ ...config, publisherUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline Editore</label>
              <input
                type="text"
                value={config.publisherTagline}
                onChange={(e) => onChange({ ...config, publisherTagline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. Be independent, be unique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Substack</label>
              <input
                type="text"
                value={config.substackName}
                onChange={(e) => onChange({ ...config, substackName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Around Sci-Fi"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amazon URL</label>
              <input
                type="url"
                value={config.amazonUrl}
                onChange={(e) => onChange({ ...config, amazonUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://amazon.com/dp/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goodreads URL</label>
              <input
                type="url"
                value={config.goodreadsUrl}
                onChange={(e) => onChange({ ...config, goodreadsUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://goodreads.com/book/show/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Substack URL</label>
            <input
              type="url"
              value={config.substackUrl}
              onChange={(e) => onChange({ ...config, substackUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-substack.substack.com/"
            />
          </div>
        </div>
      )}

      {activeTab === 'metadata' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Pubblicazione</label>
              <input
                type="text"
                value={config.publicationDate}
                onChange={(e) => onChange({ ...config, publicationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9 July 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                type="text"
                value={config.isbn}
                onChange={(e) => onChange({ ...config, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="979-..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ASIN</label>
              <input
                type="text"
                value={config.asin}
                onChange={(e) => onChange({ ...config, asin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="B0..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensione File</label>
              <input
                type="text"
                value={config.fileSize}
                onChange={(e) => onChange({ ...config, fileSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.1 MB"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero Pagine</label>
              <input
                type="number"
                min={0}
                value={config.pageCount}
                onChange={(e) => onChange({ ...config, pageCount: parseInt(e.target.value || '0', 10) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lingua</label>
              <input
                type="text"
                value={config.language}
                onChange={(e) => onChange({ ...config, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="English"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
              <input
                type="text"
                value={config.format}
                onChange={(e) => onChange({ ...config, format: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kindle Edition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valutazione (0–5)</label>
              <input
                type="number"
                step={0.1}
                min={0}
                max={5}
                value={config.rating}
                onChange={(e) => onChange({ ...config, rating: parseFloat(e.target.value || '0') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numero Recensioni</label>
            <input
              type="number"
              min={0}
              value={config.reviewCount}
              onChange={(e) => onChange({ ...config, reviewCount: parseInt(e.target.value || '0', 10) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFree"
              checked={config.isFree}
              onChange={(e) => onChange({ ...config, isFree: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-gray-700">Gratuito</label>
          </div>
          {!config.isFree && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo</label>
              <input
                type="number"
                step={0.01}
                min={0}
                value={config.price ?? ''}
                onChange={(e) => onChange({ ...config, price: e.target.value === '' ? null : parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9.99"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Categorie</label>
          <TagInput
            values={config.categories}
            onChange={(values) => onChange({ ...config, categories: values })}
            placeholder="Aggiungi categoria e premi Invio"
          />
          <p className="text-xs text-gray-500">Suggerimento: puoi incollare un elenco separato da virgole o righe.</p>
        </div>
      )}
    </div>
  )
}
