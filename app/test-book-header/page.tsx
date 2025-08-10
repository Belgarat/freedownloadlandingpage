'use client'

import BookHeader from '@/components/landing/BookHeader'

export default function TestBookHeaderPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">BookHeader Test Page</h1>
        
        <BookHeader />
      </div>
    </div>
  )
}
