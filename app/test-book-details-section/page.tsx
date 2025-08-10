'use client'

import BookDetailsSection from '@/components/landing/BookDetailsSection'

export default function TestBookDetailsSectionPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">BookDetailsSection Test Page</h1>
        
        <BookDetailsSection offerEndDate="2025-03-15T23:59:59Z" />
      </div>
    </div>
  )
}
