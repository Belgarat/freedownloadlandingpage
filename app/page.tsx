'use client'

import { useState } from 'react'
import { Mail, Download, Star, BookOpen, ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useAnalytics } from '@/lib/useAnalytics'
import CookieConsent from '@/components/CookieConsent'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { trackEmailSubmit } = useAnalytics()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError('')
    
    try {
      // Track analytics
      await trackEmailSubmit(email)
      
      // Send ebook via API
      const response = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: email.split('@')[0] // Use email prefix as name
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send ebook')
      }

      setIsSubmitted(true)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error submitting email:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - mobile optimized */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400" />
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-serif leading-tight">Fish Cannot Carry Guns</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-200">
              <span>by Michael B. Morgan</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-4 h-4" /> 5.0 <span className="text-gray-300 font-normal">(1 review)</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs text-amber-200 mt-2">
              <span>#SciFi</span>
              <span>#Dystopian</span>
              <span>#Cyberpunk</span>
              <span>#Androids</span>
              <span>#DangerForHumanity</span>
            </div>
          </div>

          {/* Main Content - mobile optimized */}
          <main id="main-content" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            {/* Book Cover Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-8 text-center border border-teal-700/50">
                <div className="w-64 sm:w-80 md:w-96 h-80 sm:h-96 md:h-[28rem] mx-auto bg-gradient-to-br from-teal-800 to-cyan-800 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-center border border-teal-600">
                  <img 
                    src="/ebook_cover.webp" 
                    alt="Fish Cannot Carry Guns - Book Cover" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Download Your Free Copy</h2>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-teal-100 mb-2">
                        Enter your email to get your free copy
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300 w-5 h-5" aria-hidden="true" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('') // Clear error when user types
                          }}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                        />
                      </div>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 flex items-center space-x-2" role="alert" aria-live="polite">
                        <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" aria-hidden="true" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                                                <Download className="w-5 h-5" aria-hidden="true" />
                      <span>Get Free Copy</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                      <p className="text-green-300 font-medium">
                        ✓ Thank you! Check your email for your free copy.
                      </p>
                    </div>
                    <a
                      href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
                    >
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                      <span>Add to Goodreads</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Substack Subscription Box */}
              <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 text-center border border-teal-700/50">
                <p className="text-teal-100 text-sm mb-4">
                I write Around SciFi on Substack. If you'd like, drop by. It's a nice space where curious readers and talented authors share their love for speculative worlds.
                </p>
                <a
                  href="https://aroundscifi.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                >
                  <span>Visit Substack</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-teal-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">About the Book</h3>
                <ul className="list-disc pl-5 text-teal-100 mb-4 text-sm sm:text-base">
                  <li><b>Betrayal Circuit:</b> Captain Stalworth believes he can trust Private Jude Veil. He is wrong.</li>
                  <li><b>Devil's Advocate:</b> What if you were trapped in a cell... with the person who killed you?</li>
                  <li><b>The Old Man and the Fee:</b> On an ordinary day in Siberia, something extraordinary fell from the sky.</li>
                  <li><b>All of a Sudden:</b> James has been afraid all his life, but the heart of the forest won't stop calling him.</li>
                  <li><b>Fish Cannot Carry Guns:</b> All his life, John had thought he was safe...</li>
                </ul>
                <p className="text-xs text-teal-200">All interior illustrations are original works by the author.</p>
              </div>

              {/* Author Bio */}
              <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-teal-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
                <p className="text-teal-100 whitespace-pre-line text-sm sm:text-base">
                  Is the snowflake responsible for the avalanche?
                  {"\n"}
                  I'm a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don't always offer easy answers.
                  {"\n"}
                  Consultant by day, author by night.
                  {"\n"}
                  Proud father. Grateful husband.
                  {"\n"}
                  Based in the U.S., often on the move.
                </p>
              </div>

              {/* Goodreads Link */}
              <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 text-center border border-teal-700/50">
                <p className="text-teal-100 mb-3 text-sm">
                  Support independent authors by adding this book to your Goodreads reading list
                </p>
                <a
                  href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                >
                  Add to Goodreads
                </a>
              </div>
            </div>
          </main>

          {/* Footer with imprint logo and info - mobile optimized */}
          <div className="mt-12 sm:mt-16 text-center text-teal-200 text-sm flex flex-col items-center gap-4">
            <p>© 2025 Michael B. Morgan. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a href="https://37indielab.com/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="/logo_transparent.png" alt="3/7 Indie Lab Logo" className="h-10 sm:h-12 mb-2" style={{maxWidth:'80px'}} />
              </a>
              <div className="text-xs text-teal-200 max-w-md px-4">
                <strong className="text-white">3/7 Indie Lab</strong> — Be independent, be unique.<br/>
                At 3/7 Indie Lab, we are fiercely independent. We will not conform to mainstream ideas or chase profits. We will always support authors who want to push the boundaries of the publishing market with an independent — and good — writing.<br/>
                <a href="https://37indielab.com/" target="_blank" rel="noopener noreferrer" className="underline text-teal-300">www.37indielab.com</a>
                <br/>
                <span className="italic">3/7 Indie Lab is an author-centric imprint. Our mission is to help independent authors publish their books. All rights, responsibilities, and liabilities associated with the content and distribution of the books remain solely with the respective authors or other entities involved.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-teal-900 border border-teal-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 id="modal-title" className="text-lg font-semibold text-white">Email Sent Successfully!</h3>
              </div>
              <button
                onClick={closeSuccessModal}
                className="text-teal-300 hover:text-white transition-colors"
                aria-label="Close success modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <p className="text-teal-100">
                We've sent your free sample to <span className="font-semibold text-white">{email}</span>
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
                >
                  Add to Goodreads
                </a>
                <button
                  onClick={closeSuccessModal}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded text-xs transition-colors"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
} 