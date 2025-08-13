'use client'

import { useState } from 'react'

interface Character {
  id: string
  name: string
  role: string
  description: string
  imageUrl?: string
  traits: string[]
  background: string
}

interface CharacterProfilesProps {
  characters?: Character[]
  title?: string
  className?: string
}

export default function CharacterProfiles({ characters, title = 'Characters', className = '' }: CharacterProfilesProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  if (!characters || characters.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">No character profiles available</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div 
              key={character.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedCharacter(selectedCharacter === character.id ? null : character.id)}
            >
              <div className="flex items-start space-x-3">
                {character.imageUrl ? (
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{character.name}</h4>
                  <p className="text-sm text-gray-600">{character.role}</p>
                  
                  {/* Character traits */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {character.traits.slice(0, 3).map((trait, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                    {character.traits.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{character.traits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded character details */}
              {selectedCharacter === character.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">{character.description}</p>
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm mb-2">Background</h5>
                    <p className="text-sm text-gray-600">{character.background}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
