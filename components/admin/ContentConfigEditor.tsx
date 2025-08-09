'use client'

import { useState } from 'react'
import { ContentConfig } from '@/lib/config-loader'
import WYSIWYGEditor from '@/components/WYSIWYGEditor'

interface ContentConfigEditorProps {
  config: ContentConfig
  onChange: (config: ContentConfig) => void
}

export default function ContentConfigEditor({ config, onChange }: ContentConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'author' | 'stories' | 'testimonials' | 'footer'>('about')

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'author', label: 'Author' },
    { id: 'stories', label: 'Stories' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'footer', label: 'Footer' },
  ] as const

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Contenuti</h3>
        <p className="text-sm text-blue-700 mt-1">Organizza i contenuti in sezioni e modifica testo ricco con l'editor.</p>
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

      {activeTab === 'about' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">About Book</label>
          <WYSIWYGEditor
            value={config.aboutBook}
            onChange={(value) => onChange({ ...config, aboutBook: value })}
            placeholder="Write about the book..."
          />
        </div>
      )}

      {activeTab === 'author' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Author Bio</label>
          <WYSIWYGEditor
            value={config.authorBio}
            onChange={(value) => onChange({ ...config, authorBio: value })}
            placeholder="Write about the author..."
          />
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Stories</h3>
          {config.stories.map((story, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Story {index + 1}</h4>
                <button
                  onClick={() => {
                    const newStories = config.stories.filter((_, i) => i !== index)
                    onChange({ ...config, stories: newStories })
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={story.title}
                  onChange={(e) => {
                    const newStories = [...config.stories]
                    newStories[index] = { ...story, title: e.target.value }
                    onChange({ ...config, stories: newStories })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Story title"
                />
                <textarea
                  value={story.description}
                  onChange={(e) => {
                    const newStories = [...config.stories]
                    newStories[index] = { ...story, description: e.target.value }
                    onChange({ ...config, stories: newStories })
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Story description"
                />
                <WYSIWYGEditor
                  value={story.content}
                  onChange={(value) => {
                    const newStories = [...config.stories]
                    newStories[index] = { ...story, content: value }
                    onChange({ ...config, stories: newStories })
                  }}
                  placeholder="Write story content..."
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newStories = [...config.stories, { title: '', description: '', content: '' }]
              onChange({ ...config, stories: newStories })
            }}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Story
          </button>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
          {config.testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Testimonial {index + 1}</h4>
                <button
                  onClick={() => {
                    const newTestimonials = config.testimonials.filter((_, i) => i !== index)
                    onChange({ ...config, testimonials: newTestimonials })
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <textarea
                  value={testimonial.text}
                  onChange={(e) => {
                    const newTestimonials = [...config.testimonials]
                    newTestimonials[index] = { ...testimonial, text: e.target.value }
                    onChange({ ...config, testimonials: newTestimonials })
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Testimonial text"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials]
                      newTestimonials[index] = { ...testimonial, author: e.target.value }
                      onChange({ ...config, testimonials: newTestimonials })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Author name"
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={testimonial.rating}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials]
                      newTestimonials[index] = { ...testimonial, rating: parseFloat(e.target.value) }
                      onChange({ ...config, testimonials: newTestimonials })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rating"
                  />
                  <input
                    type="text"
                    value={testimonial.source}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials]
                      newTestimonials[index] = { ...testimonial, source: e.target.value }
                      onChange({ ...config, testimonials: newTestimonials })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Source"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newTestimonials = [...config.testimonials, { text: '', author: '', rating: 5, source: '' }]
              onChange({ ...config, testimonials: newTestimonials })
            }}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Testimonial
          </button>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Footer</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
            <input
              type="text"
              value={config.footer.copyright}
              onChange={(e) => onChange({ ...config, footer: { ...config.footer, copyright: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="© 2025 All rights reserved"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Text</label>
            <input
              type="text"
              value={config.footer.supportText}
              onChange={(e) => onChange({ ...config, footer: { ...config.footer, supportText: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Need help? Contact us"
            />
          </div>
        </div>
      )}
    </div>
  )
}
