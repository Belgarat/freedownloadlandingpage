'use client'

import { useState } from 'react'

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  category?: string
  imageUrl?: string
}

interface TimelineProps {
  events?: TimelineEvent[]
  title?: string
  className?: string
}

export default function Timeline({ events, title = 'Timeline', className = '' }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  if (!events || events.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">No timeline events available</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {events.map((event, index) => (
            <div key={event.id} className="relative mb-6 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2"></div>
              
              {/* Event content */}
              <div className="ml-8">
                <div 
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                      {event.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
                          {event.category}
                        </span>
                      )}
                    </div>
                    {event.imageUrl && (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>
                  
                  {/* Expanded description */}
                  {selectedEvent === event.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
