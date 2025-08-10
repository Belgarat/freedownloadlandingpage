'use client'

import FooterSection from '@/components/landing/FooterSection'

export default function TestFooterSectionPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">FooterSection Test Page</h1>
        
        <FooterSection />
      </div>
    </div>
  )
}
