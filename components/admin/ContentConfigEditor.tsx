'use client'

import { ContentConfig } from '@/lib/config-loader'
import WYSIWYGEditor from '@/components/WYSIWYGEditor'

interface ContentConfigEditorProps {
  config: ContentConfig
  onChange: (config: ContentConfig) => void
}

export default function ContentConfigEditor({ config, onChange }: ContentConfigEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Book</label>
        <WYSIWYGEditor
          value={config.aboutBook}
          onChange={(value) => onChange({...config, aboutBook: value})}
          placeholder="Write about the book..."
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

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stories</h3>
        <div className="space-y-4">
          {config.stories.map((story, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Story {index + 1}</h4>
                <button
                  onClick={() => {
                    const newStories = config.stories.filter((_, i) => i !== index)
                    onChange({...config, stories: newStories})
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
                    newStories[index] = {...story, title: e.target.value}
                    onChange({...config, stories: newStories})
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Story title"
                />
                <textarea
                  value={story.description}
                  onChange={(e) => {
                    const newStories = [...config.stories]
                    newStories[index] = {...story, description: e.target.value}
                    onChange({...config, stories: newStories})
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Story description"
                />
                <WYSIWYGEditor
                  value={story.content}
                  onChange={(value) => {
                    const newStories = [...config.stories]
                    newStories[index] = {...story, content: value}
                    onChange({...config, stories: newStories})
                  }}
                  placeholder="Write story content..."
                  className="mb-2"
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              const newStories = [...config.stories, { title: '', description: '', content: '' }]
              onChange({...config, stories: newStories})
            }}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Story
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonials</h3>
        <div className="space-y-4">
          {config.testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Testimonial {index + 1}</h4>
                <button
                  onClick={() => {
                    const newTestimonials = config.testimonials.filter((_, i) => i !== index)
                    onChange({...config, testimonials: newTestimonials})
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
                    newTestimonials[index] = {...testimonial, text: e.target.value}
                    onChange({...config, testimonials: newTestimonials})
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
                      newTestimonials[index] = {...testimonial, author: e.target.value}
                      onChange({...config, testimonials: newTestimonials})
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
                      newTestimonials[index] = {...testimonial, rating: parseFloat(e.target.value)}
                      onChange({...config, testimonials: newTestimonials})
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rating"
                  />
                  <input
                    type="text"
                    value={testimonial.source}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials]
                      newTestimonials[index] = {...testimonial, source: e.target.value}
                      onChange({...config, testimonials: newTestimonials})
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
              onChange({...config, testimonials: newTestimonials})
            }}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Footer</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
          <input
            type="text"
            value={config.footer.copyright}
            onChange={(e) => onChange({...config, footer: {...config.footer, copyright: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="© 2025 All rights reserved"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Text</label>
          <input
            type="text"
            value={config.footer.supportText}
            onChange={(e) => onChange({...config, footer: {...config.footer, supportText: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Need help? Contact us"
          />
        </div>
      </div>
    </div>
  )
}
