'use client'

import { useEffect } from 'react'
import BookDetailsSection from '@/components/landing/BookDetailsSection'

export default function TestBookDetailsSectionEnabledPage() {
  useEffect(() => {
    // Simula l'abilitazione dei flag di layout
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.__MOCK_CONFIG__ = {
        theme: {
          layout: {
            showCountdown: true,
            showStories: true,
            showTestimonials: true,
            showAwards: true,
            showRankings: true
          }
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">BookDetailsSection Enabled Test Page</h1>
        
        <BookDetailsSection offerEndDate="2025-03-15T23:59:59Z" />
      </div>
    </div>
  )
}
