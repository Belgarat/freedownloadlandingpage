 'use client'

import { useState } from 'react'
import { Mail, Download, AlertCircle, CheckCircle, X, BookOpen, ExternalLink, Palette } from 'lucide-react'
import CookieConsent from '@/components/CookieConsent'
import CountdownTimer from '@/components/CountdownTimer'
import { useAnalytics } from '@/lib/useAnalytics'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // Initialize analytics
  const { trackEmailSubmit, trackGoodreadsClick, trackSubstackClick, trackPublisherClick } = useAnalytics()
  
  // Get offer end date from environment
  const offerEndDate = process.env.NEXT_PUBLIC_OFFER_END_DATE || '2025-03-15T23:59:59Z'
  const isOfferActive = new Date(offerEndDate) > new Date()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      // Track successful email submission
      await trackEmailSubmit(email)
      
      setIsSubmitted(true)
      setShowSuccessModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-serif leading-tight">Fish Cannot Carry Guns</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-200">
              <span>by Michael B. Morgan</span>
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
            {/* Countdown Timer - Mobile Only (above book cover) */}
            {isOfferActive && (
              <div className="lg:hidden">
                <CountdownTimer endDate={offerEndDate} className="mb-4" />
              </div>
            )}
            
            {/* Book Cover Section */}
            <div className="space-y-4 sm:space-y-6">
              
              <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-8 text-center border border-teal-700/50">
                <div className="w-64 sm:w-80 md:w-96 mx-auto bg-gradient-to-br from-teal-800 to-cyan-800 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-center">
                  <picture>
                    <source 
                      media="(min-width: 768px)" 
                      srcSet="/ebook_cover.webp"
                    />
                    <source 
                      media="(min-width: 640px)" 
                      srcSet="/ebook_cover_medium.webp"
                    />
                    <img 
                      src="/ebook_cover_small.webp" 
                      alt="Fish Cannot Carry Guns - Book Cover" 
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="high"
                      width="384"
                      height="512"
                    />
                  </picture>
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
                            setError('')
                          }}
                          placeholder="your@email.com"
                          required
                          autoComplete="email"
                          aria-describedby={error ? 'email-help email-error' : 'email-help'}
                          className="w-full pl-10 pr-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                        />
                        <p id="email-help" className="mt-2 text-xs text-teal-200">No spam. Unsubscribe anytime.</p>
                      </div>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 flex items-center space-x-2" role="alert" aria-live="polite">
                        <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" aria-hidden="true" />
                        <p id="email-error" className="text-red-300 text-sm">{error}</p>
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
                    <div className="text-xs text-amber-200 text-center">Limited-time free download</div>
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
                      onClick={trackGoodreadsClick}
                    >
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                      <span>Add to Goodreads</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Substack Subscription Box */}
              <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 text-center border border-teal-700/50">
                <p className="text-teal-100 text-sm mb-4">
                  Drop by and visit me on Substack at Around SciFi. It&apos;s a space where curious readers and talented authors share their love for speculative worlds.
                </p>
                <a
                  href="https://aroundscifi.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                  onClick={trackSubstackClick}
                >
                  <span>Visit Substack</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              {/* Goodreads link removed pre-submit to focus on primary CTA */}
            </div>

            {/* Book Details Section */}
            <div className="space-y-6 sm:space-y-8">
              {/* Description */}
              <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-teal-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">About the Book</h3>
                <p className="text-teal-100 whitespace-pre-line text-sm sm:text-base">
                  These stories in Fish Cannot Carry Guns aren&apos;t about technology itself, but about the people it leaves behind, changed. Sometimes fractured, sometimes closer to the truth, always somewhere they never expected to be.
                </p>
                <h4 className="text-lg font-semibold text-white mb-4 mt-4">A Glimpse Inside the Stories</h4>
                 <ul className="text-teal-100 whitespace-pre-line text-sm sm:text-base mb-4">
                  <li><strong>Betrayal Circuit:</strong> Captain Stalworth thought he could trust Private Jude Veil. He was wrong.</li>
                   <li><strong>Devil&apos;s Advocate:</strong> What if you found yourself trapped in a cell… with the person who killed you?</li>
                  <li><strong>The Old Man and the Fee:</strong> In Siberia, something extraordinary falls from the sky.</li>
                  <li><strong>All of a Sudden:</strong> James has lived his whole life in fear, yet the heart of the forest keeps calling him.</li>
                   <li><strong>Fish Cannot Carry Guns:</strong> John always thought he was safe. He was wrong.</li>
                </ul>
                  {/* Removed rating and duplicated tags for cleaner layout */}
                  <div className="bg-amber-900/20 border border-amber-700/50 rounded p-3 mt-4">
                    <p className="text-sm text-amber-200 font-medium text-center flex items-center justify-center gap-2">
                      <Palette className="w-4 h-4 text-amber-300" />
                      All interior illustrations are original works by the author
                    </p>
                  </div>
              </div>

              {/* Countdown Timer - Desktop Only */}
              {isOfferActive && (
                <div className="hidden lg:block">
                  <CountdownTimer endDate={offerEndDate} className="mb-4" />
                </div>
              )}

              {/* Author Bio */}
              <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-teal-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
                <p className="text-teal-100 whitespace-pre-line text-sm sm:text-base">
                  Is the snowflake responsible for the avalanche? I&apos;m a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don&apos;t always offer easy answers. Consultant by day, author by night. Proud father. Grateful husband. Based in the U.S., often on the move.
                </p>
              </div>

            </div>

            {/* Goodreads full-width footer box */}
            <div className="lg:col-span-2">
              <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 text-center border border-teal-700/50">
                <p className="text-teal-100 mb-3 text-sm">
                  Prefer to check it first? View the book on Goodreads.
                </p>
                <a
                  href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                  onClick={trackGoodreadsClick}
                >
                  View on Goodreads
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
                              <a 
                  href="https://37indielab.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block"
                  onClick={trackPublisherClick}
                >
                <img src="/logo_transparent.png" alt="3/7 Indie Lab Logo" className="h-10 sm:h-12 mb-2" style={{maxWidth:'80px'}} />
              </a>
              <div className="text-xs text-teal-200 max-w-md px-4">
                <strong className="text-white">3/7 Indie Lab</strong> — Be independent, be unique.<br/>
                We support independent authors who push the boundaries of publishing. Learn more:<br/>
                                  <a
                    href="https://37indielab.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-teal-300"
                    onClick={trackPublisherClick}
                  >
                  www.37indielab.com
                </a>
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
          <div className="bg-[#073E44] border border-teal-700 rounded-lg p-6 max-w-md w-full mx-4">
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
                We&apos;ve sent your free copy to <span className="font-semibold text-white">{email}</span>
              </p>
              
              <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3">
                <p className="text-amber-200 text-xs">
                  <strong>Important:</strong> Please check your spam/junk folder if you don&apos;t see the email in your inbox.
                </p>
              </div>
              
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                 <p className="text-blue-200 text-xs">
                   <strong>Support Independent Authors:</strong> Since this book is completely free, we&apos;d be grateful if you could add &quot;Fish Cannot Carry Guns&quot; to your Goodreads reading list once you&apos;ve had a chance to read it. Your support helps independent authors like Michael B. Morgan continue writing.
                 </p>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-xs transition-colors"
                  onClick={trackGoodreadsClick}
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