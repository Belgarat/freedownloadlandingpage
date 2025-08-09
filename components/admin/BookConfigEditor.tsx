'use client'

import { BookConfig } from '@/lib/config-loader'
import WYSIWYGEditor from '@/components/WYSIWYGEditor'

interface BookConfigEditorProps {
  config: BookConfig
  onChange: (config: BookConfig) => void
}

export default function BookConfigEditor({ config, onChange }: BookConfigEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({...config, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Book title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={config.subtitle}
          onChange={(e) => onChange({...config, subtitle: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Book subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
        <input
          type="text"
          value={config.author}
          onChange={(e) => onChange({...config, author: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Author name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <WYSIWYGEditor
          value={config.description}
          onChange={(value) => onChange({...config, description: value})}
          placeholder="Write the book description..."
          className="mb-4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
        <WYSIWYGEditor
          value={config.authorBio}
          onChange={(value) => onChange({...config, authorBio: value})}
          placeholder="Write about the author..."
          className="mb-4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
        <input
          type="text"
          value={config.publisher}
          onChange={(e) => onChange({...config, publisher: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Publisher name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Publisher URL</label>
        <input
          type="url"
          value={config.publisherUrl}
          onChange={(e) => onChange({...config, publisherUrl: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://publisher.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Publisher Tagline</label>
        <input
          type="text"
          value={config.publisherTagline}
          onChange={(e) => onChange({...config, publisherTagline: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Publisher tagline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        <input
          type="text"
          value={config.coverImage}
          onChange={(e) => onChange({...config, coverImage: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="/path/to/cover.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={config.rating}
            onChange={(e) => onChange({...config, rating: parseFloat(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
          <input
            type="number"
            min="0"
            value={config.reviewCount}
            onChange={(e) => onChange({...config, reviewCount: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
          <input
            type="text"
            value={config.publicationDate}
            onChange={(e) => onChange({...config, publicationDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="July 9, 2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
          <input
            type="text"
            value={config.isbn}
            onChange={(e) => onChange({...config, isbn: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="979-1298569133"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ASIN</label>
          <input
            type="text"
            value={config.asin}
            onChange={(e) => onChange({...config, asin: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="B0DS55TQ8R"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
          <input
            type="text"
            value={config.fileSize}
            onChange={(e) => onChange({...config, fileSize: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2.1 MB"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
          <input
            type="number"
            min="0"
            value={config.pageCount}
            onChange={(e) => onChange({...config, pageCount: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <input
            type="text"
            value={config.language}
            onChange={(e) => onChange({...config, language: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="English"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
        <input
          type="text"
          value={config.format}
          onChange={(e) => onChange({...config, format: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kindle Edition"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFree"
          checked={config.isFree}
          onChange={(e) => onChange({...config, isFree: e.target.checked})}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isFree" className="text-sm font-medium text-gray-700">Is Free</label>
      </div>

      {!config.isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={config.price || ''}
            onChange={(e) => onChange({...config, price: parseFloat(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9.99"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories (comma separated)</label>
        <input
          type="text"
          value={config.categories.join(', ')}
          onChange={(e) => onChange({...config, categories: e.target.value.split(',').map(cat => cat.trim()).filter(cat => cat)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="SciFi, Dystopian, Cyberpunk"
        />
      </div>
    </div>
  )
}
