'use client'

import { SEOConfig } from '@/lib/config-loader'

interface SEOConfigEditorProps {
  config: SEOConfig
  onChange: (config: SEOConfig) => void
}

export default function SEOConfigEditor({ config, onChange }: SEOConfigEditorProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Tags</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.meta.title}
            onChange={(e) => onChange({...config, meta: {...config.meta, title: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.meta.description}
            onChange={(e) => onChange({...config, meta: {...config.meta, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A compelling description of the book..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
          <input
            type="text"
            value={config.meta.keywords}
            onChange={(e) => onChange({...config, meta: {...config.meta, keywords: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sci-fi, dystopian, cyberpunk, free ebook"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={config.meta.author}
            onChange={(e) => onChange({...config, meta: {...config.meta, author: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Robots</label>
          <input
            type="text"
            value={config.meta.robots}
            onChange={(e) => onChange({...config, meta: {...config.meta, robots: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="index, follow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
          <input
            type="url"
            value={config.meta.canonical}
            onChange={(e) => onChange({...config, meta: {...config.meta, canonical: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/book"
          />
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={config.openGraph.title}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, title: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.openGraph.description}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A compelling description for social media..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <input
            type="text"
            value={config.openGraph.type}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, type: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="website"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={config.openGraph.url}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, url: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/book"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="url"
            value={config.openGraph.image}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, image: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={config.openGraph.siteName}
            onChange={(e) => onChange({...config, openGraph: {...config.openGraph, siteName: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Book Landing Stack"
          />
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Cards</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
          <select
            value={config.twitter.card}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, card: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Book Title - Author Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={config.twitter.description}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, description: e.target.value}})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A compelling description for Twitter..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="url"
            value={config.twitter.image}
            onChange={(e) => onChange({...config, twitter: {...config.twitter, image: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Structured Data</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book Schema (JSON-LD)</label>
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
            placeholder='{"@type": "Book", "name": "Book Title", "author": {"@type": "Person", "name": "Author Name"}}'
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sitemap Settings</h3>
        
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Frequency</label>
            <select
              value={config.sitemap.changefreq}
              onChange={(e) => onChange({...config, sitemap: {...config.sitemap, changefreq: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  )
}
