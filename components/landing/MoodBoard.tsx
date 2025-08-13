'use client'

import { useState } from 'react'

interface MoodBoardItem {
  id: string
  type: 'image' | 'text' | 'color'
  content: string
  description?: string
}

interface MoodBoardProps {
  items?: MoodBoardItem[]
  title?: string
  atmosphere?: string
  className?: string
}

export default function MoodBoard({ items, title = 'Mood Board', atmosphere, className = '' }: MoodBoardProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  if (!items || items.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">No mood board items available</p>
      </div>
    )
  }

  const renderItem = (item: MoodBoardItem) => {
    switch (item.type) {
      case 'image':
        return (
          <img 
            src={item.content} 
            alt={item.description || 'Mood board image'}
            className="w-full h-32 object-cover rounded-lg"
          />
        )
      case 'color':
        return (
          <div 
            className="w-full h-32 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: item.content }}
          />
        )
      case 'text':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center p-4">
            <p className="text-center text-gray-700 font-medium">{item.content}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {atmosphere && (
          <p className="text-sm text-gray-600 mt-1">{atmosphere}</p>
        )}
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              {renderItem(item)}
              {item.description && (
                <p className="text-xs text-gray-600 mt-2 text-center">{item.description}</p>
              )}
            </div>
          ))}
        </div>
        
        {/* Selected item details */}
        {selectedItem && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            {items.find(item => item.id === selectedItem) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {items.find(item => item.id === selectedItem)?.description || 'Item Details'}
                </h4>
                <div className="flex justify-center">
                  {renderItem(items.find(item => item.id === selectedItem)!)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
