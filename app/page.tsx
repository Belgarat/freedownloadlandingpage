'use client'

import { useMemo, useState } from 'react'
import { Mail, Download, AlertCircle, CheckCircle, X, BookOpen, ExternalLink, Star, Palette } from 'lucide-react'
import CookieConsent from '@/components/CookieConsent'
import CountdownTimer from '@/components/CountdownTimer'
import { useAnalytics } from '@/lib/useAnalytics'
import { useConfig } from '@/lib/useConfig'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // Initialize analytics
  const { trackEmailSubmit, trackGoodreadsClick, trackSubstackClick, trackPublisherClick } = useAnalytics()
  const { book, content, marketing, theme } = useConfig()
  const aboutBookHtml = (book?.description && book.description.trim()) ? book.description : (content?.aboutBook || '')
  const authorBioHtml = (book?.authorBio && book.authorBio.trim()) ? book.authorBio : (content?.authorBio || '')
  const layout = theme?.layout
  const layoutType = layout?.type || 'default'
  const isMinimal = layoutType === 'minimal'
  const containerMax = layoutType === 'full-width' ? 'max-w-7xl' : 'max-w-4xl'
  const gridCols = layoutType === 'full-width' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
  const leftColClass = ''
  const rightColClass = ''
  
  // Get offer end date from environment
  const offerEndDate = useMemo(() => {
    return marketing?.offer?.endDate || process.env.NEXT_PUBLIC_OFFER_END_DATE || '2025-03-15T23:59:59Z'
  }, [marketing])

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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-background)',
        backgroundImage: 'var(--bg-gradient)'
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      <div className="container mx-auto px-4 py-4 sm:py-8">
            <div className={`${containerMax} mx-auto text-theme-primary`}>
          {/* Header - mobile optimized */}
              <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-[var(--color-accent)]" />
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-theme-primary leading-tight" style={{ fontFamily: 'var(--font-heading, inherit)' }}>{book?.title || 'Fish Cannot Carry Guns'}</span>
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

          {/* Main Content - mobile optimized */}
          <main id="main-content" className={`grid ${gridCols} gap-6 lg:gap-12 items-start`}>
            {/* Countdown Timer - Mobile Only (above book cover) */}
            {layout?.showCountdown !== false && (
              <div className="lg:hidden">
                <CountdownTimer endDate={offerEndDate} className="mb-4" />
              </div>
            )}
            
            {/* Book Cover Section */}
            <div className={`space-y-4 sm:space-y-6 ${leftColClass}`}>
              
              <div className="backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-8 text-center border surface-alpha">
                <div className="w-64 sm:w-80 md:w-96 mx-auto bg-gradient-to-br from-teal-800 to-cyan-800 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-center">
                  <img
                    src={book?.coverImage || '/ebook_cover_small.webp'}
                    alt={`${book?.title || 'Book'} - Cover`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                    width="384"
                    height="512"
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
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary w-5 h-5" aria-hidden="true" />
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
                          className="w-full pl-10 pr-4 py-3 bg-theme-background/50 border border-theme-secondary rounded-lg text-theme-primary placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-base"
                        />
                      </div>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] border border-[var(--color-error)]/60 rounded-lg p-3 flex items-center space-x-2" role="alert" aria-live="polite">
                        <AlertCircle className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" aria-hidden="true" />
                        <p className="text-[var(--color-error)] text-sm">{error}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,black)] disabled:opacity-70 text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
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
                    <div className="bg-[color-mix(in_srgb,var(--color-success)_20%,transparent)] border border-[var(--color-success)]/60 rounded-lg p-4">
                      <p className="text-[var(--color-success)] font-medium">
                        ✓ Thank you! Check your email for your free copy.
                      </p>
                    </div>
                    <a
                      href={book?.goodreadsUrl || 'https://www.goodreads.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block bg-[var(--color-secondary)] hover:bg-[color-mix(in_srgb,var(--color-secondary)_85%,black)] text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
                    >
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                      <span>Add to Goodreads</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Substack Subscription Box */}
              {!isMinimal && (
              <div className="backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 text-center border border-theme-secondary/50" style={{ backgroundColor: 'color-mix(in srgb, var(--color-background) 85%, black)' }}>
                <p className="text-theme-secondary text-sm mb-4">
                  I write {book?.substackName || 'Around SciFi'} on Substack. If you'd like, drop by. It's a nice space where curious readers and talented authors share their love for speculative worlds.
                </p>
                <a
                  href={book?.substackUrl || 'https://substack.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_85%,black)] text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                  onClick={trackSubstackClick}
                >
                  <span>Visit Substack</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              )}
            </div>

            {/* Book Details Section */}
            <div className={`space-y-6 sm:space-y-8 ${rightColClass}`}>
              {/* Description */}
              <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                <h3 className="text-lg font-semibold text-white mb-4">About the Book</h3>
                <div className="prose prose-invert max-w-none text-theme-secondary mb-4 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: aboutBookHtml }} />
                                  {/* Review e tag */}
                  <div className="flex flex-col items-center gap-3 text-sm text-gray-200 mb-4">
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Star className="w-4 h-4" /> {book?.rating ?? 5.0} <span className="text-gray-300 font-normal">({book?.reviewCount ?? 1} review{(book?.reviewCount ?? 1) === 1 ? '' : 's'})</span>
                    </span>
                    <div className="flex items-center gap-1 text-xs text-theme-muted">
                      {(book?.categories || ['SciFi','Dystopian','Cyberpunk']).map((c) => (
                        <span key={c}>#{c}</span>
                      ))}
                    </div>
                  </div>
                                  <div className="rounded p-3 mt-4 border" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)', borderColor: 'color-mix(in srgb, var(--color-background) 80%, white 20%)' }}>
                    <p className="text-sm text-theme-primary font-medium text-center flex items-center justify-center gap-2">
                      <Palette className="w-4 h-4 text-[var(--color-accent)]" />
                      All interior illustrations are original works by the author
                    </p>
                  </div>
              </div>

              {/* Countdown Timer - Desktop Only */}
              {layout?.showCountdown !== false && (
                <div className="hidden lg:block">
                  <CountdownTimer endDate={offerEndDate} className="mb-4" />
                </div>
              )}

              {/* Author Bio */}
              <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
                <div className="prose prose-invert max-w-none text-theme-secondary text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: authorBioHtml }} />
              </div>

              {/* Stories */}
              {layout?.showStories !== false && (content?.stories?.length ?? 0) > 0 && (
                <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                  <h3 className="text-lg font-semibold text-white mb-4">Stories</h3>
                  <div className="space-y-6">
                    {content!.stories.map((story, idx) => (
                      <div key={idx} className="space-y-2">
                        {story.title && <h4 className="text-theme-primary font-semibold">{story.title}</h4>}
                        {story.description && <p className="text-theme-secondary text-sm">{story.description}</p>}
                        {story.content && (
                          <div className="prose prose-invert max-w-none text-theme-secondary text-sm" dangerouslySetInnerHTML={{ __html: story.content }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {layout?.showTestimonials !== false && (content?.testimonials?.length ?? 0) > 0 && (
                <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                  <h3 className="text-lg font-semibold text-white mb-4">Testimonials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content!.testimonials.map((t, idx) => (
                      <div key={idx} className="rounded border surface-alpha p-4">
                        <p className="text-theme-secondary text-sm">“{t.text}”</p>
                        <div className="mt-2 text-xs text-theme-muted">{t.author}{t.source ? ` — ${t.source}` : ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {layout?.showAwards !== false && (book?.awards?.length ?? 0) > 0 && (
                <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                  <h3 className="text-lg font-semibold text-white mb-4">Awards</h3>
                  <div className="flex flex-wrap gap-2">
                    {book!.awards.map((a, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full border text-xs surface">
                        {a.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rankings */}
              {layout?.showRankings !== false && book?.rankings && (
                <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
                  <h3 className="text-lg font-semibold text-white mb-4">Rankings</h3>
                  <ul className="list-disc pl-5 text-theme-secondary text-sm space-y-1">
                    {book.rankings.kindleStore && <li>Kindle Store: {book.rankings.kindleStore}</li>}
                    {book.rankings.sciFiAnthologies && <li>Sci-Fi Anthologies: {book.rankings.sciFiAnthologies}</li>}
                    {book.rankings.cyberpunkSciFi && <li>Cyberpunk Sci-Fi: {book.rankings.cyberpunkSciFi}</li>}
                    {book.rankings.cyberpunkBooks && <li>Cyberpunk Books: {book.rankings.cyberpunkBooks}</li>}
                  </ul>
                </div>
              )}

              {/* Goodreads Link */}
              {!isMinimal && (
              <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 text-center border surface-alpha">
                <p className="text-teal-100 mb-3 text-sm">
                  Support independent authors by adding this book to your Goodreads reading list
                </p>
                <a
                  href={book?.goodreadsUrl || 'https://www.goodreads.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[var(--color-secondary)] hover:bg-[color-mix(in_srgb,var(--color-secondary)_85%,black)] text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                  onClick={trackGoodreadsClick}
                >
                  Add to Goodreads
                </a>
              </div>
              )}
            </div>
          </main>

          {/* Footer with imprint logo and info - mobile optimized */}
          <div className="mt-12 sm:mt-16 text-center text-teal-200 text-sm flex flex-col items-center gap-4">
            <p className="text-theme-secondary">{content?.footer?.copyright || `© ${new Date().getFullYear()} ${book?.author || 'Michael B. Morgan'}. All rights reserved.`}</p>
            {content?.footer?.supportText && (
              <p className="text-xs text-teal-300" dangerouslySetInnerHTML={{ __html: content.footer.supportText }} />
            )}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a 
                  href={book?.publisherUrl || 'https://37indielab.com/'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block"
                  onClick={trackPublisherClick}
                >
                <img src="/logo_transparent.png" alt="3/7 Indie Lab Logo" className="h-10 sm:h-12 mb-2" style={{maxWidth:'80px'}} />
              </a>
              <div className="text-xs text-theme-secondary max-w-md px-4">
                <strong className="text-theme-primary">{book?.publisher || '3/7 Indie Lab'}</strong> &mdash; {book?.publisherTagline || 'Be independent, be unique.'}<br/>
                {content?.footer?.copyright || 'At 3/7 Indie Lab, we are fiercely independent. We will always support authors who want to push the boundaries of the publishing market with independent writing.'}<br/>
                                  <a
                    href={book?.publisherUrl || 'https://37indielab.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-teal-300"
                    onClick={trackPublisherClick}
                  >
                  {book?.publisherUrl?.replace('https://','') || 'www.37indielab.com'}
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