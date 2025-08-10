'use client'

import React from 'react'
import { useState } from 'react'
import { SEOConfig } from '@/lib/config-loader'

interface SEOConfigEditorProps {
  config: SEOConfig
  onChange: (config: SEOConfig) => void
}

export default function SEOConfigEditor({ config, onChange }: SEOConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'meta' | 'og' | 'twitter' | 'schema' | 'sitemap'>('meta')

  const tabs = [
    { id: 'meta', label: 'Meta' },
    { id: 'og', label: 'Open Graph' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'schema', label: 'Schema' },
    { id: 'sitemap', label: 'Sitemap' }
  ] as const;

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">SEO</h3>
        <p className="text-sm text-blue-700 mt-1">Configura meta tag, Open Graph, Twitter Cards e dati strutturati.</p>
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

      {activeTab === 'meta' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Tags</h3>
        <div className="mb-4 text-xs text-gray-600 bg-gray-50 border rounded p-3">
          Questi campi definiscono il titolo e la descrizione che appaiono nei risultati di ricerca. Imposta anche keywords, autore, robots e l’URL canonico.
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.meta.title}
            onChange={(e) => onChange({...config, meta: {...config.meta, title: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.meta.description}
            onChange={(e) => onChange({...config, meta: {...config.meta, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="A compelling description of the book..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
          <input
            type="text"
            value={config.meta.keywords}
            onChange={(e) => onChange({...config, meta: {...config.meta, keywords: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="sci-fi, dystopian, cyberpunk, free ebook"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={config.meta.author}
            onChange={(e) => onChange({...config, meta: {...config.meta, author: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Robots</label>
          <input
            type="text"
            value={config.meta.robots}
            onChange={(e) => onChange({...config, meta: {...config.meta, robots: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="index, follow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
          <input
            type="url"
            value={config.meta.canonical}
            onChange={(e) => onChange({...config, meta: {...config.meta, canonical: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="https://example.com/book"
          />
        </div>
      </div>
      )}

      {activeTab === 'og' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph</h3>
        <div className="mb-4 text-xs text-gray-600 bg-gray-50 border rounded p-3">
          Open Graph controlla l’anteprima quando condividi il link su social (titolo, descrizione, immagine, sito). Compila per un’anteprima più accattivante.
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.openGraph.title}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, title: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.openGraph.description}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="A compelling description for social media..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <input
            type="text"
            value={config.openGraph.type}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, type: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="website"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={config.openGraph.url}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, url: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="https://example.com/book"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="url"
            value={config.openGraph.image}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, image: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={config.openGraph.siteName}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, siteName: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="Book Landing Stack"
          />
        </div>
      </div>
      )}

      {activeTab === 'twitter' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Cards</h3>
        <div className="mb-4 text-xs text-gray-600 bg-gray-50 border rounded p-3">
          Twitter Cards (X) definiscono il formato dell’anteprima. Scegli “summary_large_image” per un’immagine grande, poi imposta titolo, descrizione e immagine.
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
          <select
            value={config.twitter.card}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, card: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.twitter.title}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, title: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.twitter.description}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="A compelling description for Twitter..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="url"
            value={config.twitter.image}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, image: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>
      </div>
      )}

      {activeTab === 'schema' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Structured Data</h3>
        <div className="mb-4 text-xs text-gray-600 bg-gray-50 border rounded p-3">
          I dati strutturati (JSON‑LD) aiutano i motori a capire che questa pagina parla di un libro, abilitando rich results. Puoi generarli automaticamente e poi rifinire manualmente.
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Book Schema (JSON-LD)</label>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            onClick={async () => {
              try {
                const res = await fetch('/api/config')
                const result = await res.json()
                if (!result?.success) return
                const { book, seo } = result.data
                const sameAs: string[] = []
                if (book.amazonUrl) sameAs.push(book.amazonUrl)
                if (book.goodreadsUrl) sameAs.push(book.goodreadsUrl)
                if (book.publisherUrl) sameAs.push(book.publisherUrl)
                if (book.substackUrl) sameAs.push(book.substackUrl)
                const aggregate = book.rating
                  ? { '@type': 'AggregateRating', ratingValue: book.rating, reviewCount: book.reviewCount || 1 }
                  : undefined
                const schema: any = {
                  '@context': 'https://schema.org',
                  '@type': 'Book',
                  name: book.title,
                  author: { '@type': 'Person', name: book.author },
                  image: book.coverImage,
                  datePublished: book.publicationDate,
                  isbn: book.isbn,
                  inLanguage: book.language,
                  numberOfPages: book.pageCount,
                  genre: book.categories,
                  publisher: { '@type': 'Organization', name: book.publisher },
                  bookFormat: 'EBook',
                  url: seo?.meta?.canonical || '',
                }
                if (aggregate) schema.aggregateRating = aggregate
                if (sameAs.length) schema.sameAs = sameAs
                onChange({ ...config, structuredData: { ...config.structuredData, book: schema } })
              } catch {
                // ignore
              }
            }}
          >
            {/* icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 3a1 1 0 01.894.553l1.618 3.236 3.572.519a1 1 0 01.554 1.705l-2.586 2.522.61 3.56a1 1 0 01-1.451 1.054L12 14.347l-3.211 1.689a1 1 0 01-1.451-1.054l.61-3.56-2.586-2.522a1 1 0 01.554-1.705l3.572-.519L11.106 3.553A1 1 0 0112 3z"/></svg>
            Genera da Book
          </button>
        </div>
        <div>
          <textarea
            value={JSON.stringify(config.structuredData.book, null, 2)}
            onChange={(e) => {
              try {
                const bookData = JSON.parse(e.target.value)
                onChange({...config, structuredData: {...config.structuredData, book: bookData}})
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder={`{"@type":"Book","name":"Book Title","author":{"@type":"Person","name":"Author Name"}}`}
          />
        </div>
      </div>
      )}

      {activeTab === 'sitemap' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sitemap Settings</h3>
        <div className="mb-4 text-xs text-gray-600 bg-gray-50 border rounded p-3">
          La sitemap aiuta i motori a scansionare il sito. Abilitala se vuoi esporre una sitemap.xml con priorità e frequenza di aggiornamento.
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="sitemapEnabled"
            checked={config.sitemap.enabled}
            onChange={(e) => onChange({...config, sitemap: {...config.sitemap, enabled: e.target.checked}})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">Enable Sitemap</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={config.sitemap.priority}
              onChange={(e) => onChange({...config, sitemap: {...config.sitemap, priority: parseFloat(e.target.value)}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Frequency</label>
            <select
              value={config.sitemap.changefreq}
              onChange={(e) => onChange({...config, sitemap: {...config.sitemap, changefreq: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-textarea"
            >
              <option value="always">Always</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
