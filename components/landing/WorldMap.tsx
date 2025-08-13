'use client'

import { useState } from 'react'

interface WorldMapProps {
  mapData?: {
    title: string
    description: string
    imageUrl?: string
    locations: Array<{
      name: string
      description: string
      x: number
      y: number
    }>
  }
  className?: string
}

export default function WorldMap({ mapData, className = '' }: WorldMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  if (!mapData) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">World Map</h3>
        <p className="text-gray-600">No map data available</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{mapData.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{mapData.description}</p>
      </div>
      
      <div className="relative">
        {mapData.imageUrl ? (
          <img 
            src={mapData.imageUrl} 
            alt={mapData.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-gray-600">Map placeholder</p>
            </div>
          </div>
        )}
        
        {/* Interactive locations */}
        {mapData.locations.map((location) => (
          <button
            key={location.name}
            onClick={() => setSelectedLocation(selectedLocation === location.name ? null : location.name)}
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg hover:bg-red-600 transition-colors"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title={location.name}
          />
        ))}
      </div>
      
      {/* Location details */}
      {selectedLocation && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {mapData.locations.find(loc => loc.name === selectedLocation) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                {mapData.locations.find(loc => loc.name === selectedLocation)?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {mapData.locations.find(loc => loc.name === selectedLocation)?.description}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Location list */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Key Locations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mapData.locations.map((location) => (
            <div 
              key={location.name}
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedLocation(selectedLocation === location.name ? null : location.name)}
            >
              <h5 className="font-medium text-gray-900 text-sm">{location.name}</h5>
              <p className="text-xs text-gray-600 mt-1">{location.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
