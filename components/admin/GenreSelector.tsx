'use client'

import { useState } from 'react'
import { getGenrePreset, getAllGenres } from '@/lib/genre-presets'
import { GenreType } from '@/types/genre-templates'
import { useToast } from '@/components/ui/ToastContext'
import GenrePreview from './GenrePreview'

interface GenreSelectorProps {
  onGenreSelect: (genre: GenreType) => void
  currentGenre?: GenreType
}

export default function GenreSelector({ onGenreSelect, currentGenre }: GenreSelectorProps) {
  const [selectedGenre, setSelectedGenre] = useState<GenreType | undefined>(currentGenre)
  const [previewGenre, setPreviewGenre] = useState<GenreType | undefined>(undefined)
  const { addToast } = useToast()
  const genres = getAllGenres()

  const handleGenreSelect = (genre: GenreType) => {
    setSelectedGenre(genre)
    onGenreSelect(genre)
    addToast({
      type: 'success',
      title: 'Genre Applied',
      message: `Applied ${getGenrePreset(genre).name} template`
    })
  }

  const handlePreviewGenre = (genre: GenreType) => {
    setPreviewGenre(genre)
  }

  const closePreview = () => {
    setPreviewGenre(undefined)
  }

  const getGenreIcon = (genre: GenreType) => {
    const icons = {
      fantasy: '🐉',
      romance: '💕',
      thriller: '🔪',
      scifi: '🚀',
      mystery: '🔍',
      historical: '⚔️',
      contemporary: '📚',
      'young-adult': '🌟',
      'non-fiction': '📖',
      biography: '👤'
    }
    return icons[genre] || '📚'
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Genre Template</h3>
      <p className="text-gray-600 mb-6">
        Select a genre to automatically apply optimized colors, fonts, and layout for your book type.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => {
          const preset = getGenrePreset(genre)
          const isSelected = selectedGenre === genre
          
          return (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
                             <div className="flex items-center space-x-3">
                 <span className="text-2xl">{getGenreIcon(genre)}</span>
                 <div className="text-left">
                   <h4 className="font-medium text-gray-900">{preset.name}</h4>
                   <p className="text-sm text-gray-600">{preset.description}</p>
                 </div>
               </div>
               
               {/* Action buttons */}
               <div className="flex space-x-2 mt-3">
                 <button
                   onClick={(e) => {
                     e.stopPropagation()
                     handlePreviewGenre(genre)
                   }}
                   className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                 >
                   Preview
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation()
                     handleGenreSelect(genre)
                   }}
                   className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                 >
                   Apply
                 </button>
               </div>
              
              {/* Color preview */}
              <div className="flex space-x-1 mt-3">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: preset.colorScheme.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: preset.colorScheme.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: preset.colorScheme.accent }}
                />
              </div>
              
              {/* Features */}
              {preset.features.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {preset.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {feature.replace('has', '').toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
             {selectedGenre && (
         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
           <h4 className="font-medium text-blue-900 mb-2">
             Selected: {getGenrePreset(selectedGenre).name}
           </h4>
           <p className="text-sm text-blue-700">
             This template will apply optimized colors, fonts, and layout for {selectedGenre} books.
             You can customize these settings further in the Theme and Content sections.
           </p>
         </div>
       )}
     </div>
     
     {/* Genre Preview Modal */}
     {previewGenre && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
           <div className="p-6">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold text-gray-900">
                 Preview: {getGenrePreset(previewGenre).name}
               </h2>
               <button
                 onClick={closePreview}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             <GenrePreview 
               genre={previewGenre} 
               currentConfig={null} // We'll pass the actual config later
             />
           </div>
         </div>
       </div>
     )}
   </>
   )
 }
