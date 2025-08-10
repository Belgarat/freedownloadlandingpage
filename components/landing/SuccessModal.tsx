'use client'

import { CheckCircle, X } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  email: string
  onClose: () => void
  onGoodreadsClick?: () => void
}

export default function SuccessModal({ isOpen, email, onClose, onGoodreadsClick }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-[#073E44] border border-teal-700 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 id="modal-title" className="text-lg font-semibold text-white">Email Sent Successfully!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-teal-300 hover:text-white transition-colors"
            aria-label="Close success modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        
        <div className="space-y-4 text-sm">
          <p className="text-teal-100">
            We've sent your free copy to <span className="font-semibold text-white">{email}</span>
          </p>
          
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3">
            <p className="text-amber-200 text-xs">
              <strong>Important:</strong> Please check your spam/junk folder if you don't see the email in your inbox.
            </p>
          </div>
          
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-blue-200 text-xs">
              <strong>Support Independent Authors:</strong> Since this book is completely free, we'd be grateful if you could add "Fish Cannot Carry Guns" to your Goodreads reading list once you've had a chance to read it. Your support helps independent authors like Michael B. Morgan continue writing.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <a
              href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-xs transition-colors"
              onClick={onGoodreadsClick}
            >
              Add to Goodreads
            </a>
            <button
              onClick={onClose}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded text-xs transition-colors"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
