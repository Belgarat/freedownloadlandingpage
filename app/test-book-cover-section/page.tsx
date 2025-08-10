'use client'

import BookCoverSection from '@/components/landing/BookCoverSection'

export default function TestBookCoverSectionPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">BookCoverSection Test Page</h1>
        
        <BookCoverSection />
      </div>
    </div>
  )
}
