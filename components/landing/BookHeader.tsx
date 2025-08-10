'use client'

import { BookOpen, Star } from 'lucide-react'
import { useABTestByType } from '@/lib/useABTesting'
import { useConfig } from '@/lib/useConfig'

interface BookHeaderProps {
  className?: string
}

export default function BookHeader({ className = '' }: BookHeaderProps) {
  const { book } = useConfig()
  const { assignedVariant: headlineVariant } = useABTestByType('headline')
  
  const isMinimal = false // TODO: Get from theme config when available
  
  return (
    <div className={`flex flex-col items-center mb-6 sm:mb-8 ${className}`}>
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-[var(--color-accent)]" />
        <span 
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-theme-primary leading-tight" 
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
          data-testid="main-headline"
        >
          {headlineVariant?.value || book?.title || 'Fish Cannot Carry Guns'}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-theme-secondary">
        <span>by {book?.author || 'Michael B. Morgan'}</span>
        {!isMinimal && (
          <span className="flex items-center gap-1 text-[var(--color-accent)] font-semibold">
            <Star className="w-4 h-4" /> {book?.rating ?? 5.0} <span className="text-gray-300 font-normal">({book?.reviewCount ?? 1} review{(book?.reviewCount ?? 1) === 1 ? '' : 's'})</span>
          </span>
        )}
      </div>
      
      {!isMinimal && (
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs text-theme-muted mt-2">
          {(book?.categories || ['SciFi','Dystopian','Cyberpunk']).map((c) => (
            <span key={c}>#{c}</span>
          ))}
        </div>
      )}
    </div>
  )
}
