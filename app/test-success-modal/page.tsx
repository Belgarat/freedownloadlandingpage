'use client'

import { useState } from 'react'
import SuccessModal from '@/components/landing/SuccessModal'

export default function TestSuccessModalPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('test@example.com')

  const handleGoodreadsClick = () => {
    console.log('Goodreads clicked')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-white text-2xl">SuccessModal Test Page</h1>
        
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="px-4 py-2 rounded border"
          />
          
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open Modal
          </button>
        </div>

        <SuccessModal
          isOpen={isOpen}
          email={email}
          onClose={() => setIsOpen(false)}
          onGoodreadsClick={handleGoodreadsClick}
        />
      </div>
    </div>
  )
}
