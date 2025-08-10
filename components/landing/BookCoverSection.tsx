'use client'

import { useState } from 'react'
import { Mail, Download, AlertCircle, BookOpen, ExternalLink } from 'lucide-react'
import { useAnalytics } from '@/lib/useAnalytics'
import { useConfig } from '@/lib/useConfig'
import { useABTestByType } from '@/lib/useABTesting'

interface BookCoverSectionProps {
  className?: string
}

export default function BookCoverSection({ className = '' }: BookCoverSectionProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { trackEmailSubmit, trackSubstackClick } = useAnalytics()
  const { book } = useConfig()
  const { assignedVariant: ctaVariant, trackConversion: trackCTAConversion } = useABTestByType('cta_button_color')
  
  const isMinimal = false // TODO: Get from theme config when available

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
      
      // Traccia conversione per il test A/B CTA
      await trackCTAConversion(10.50)
      
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <div className="backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-8 text-center border surface-alpha">
        <div className="w-64 sm:w-80 md:w-96 mx-auto bg-gradient-to-br from-teal-800 to-cyan-800 rounded-lg shadow-lg mb-4 sm:mb-6 flex items-center justify-center">
          <img
            src={book?.coverImage || '/ebook_cover_small.webp'}
            alt={`${book?.title || 'Book'} - Cover`}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            decoding="async"
            fetchPriority="high"
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
              className={`w-full ${ctaVariant?.css_class || 'bg-[var(--color-primary)]'} hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,black)] disabled:opacity-70 text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-base`}
              data-testid="cta-button"
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
  )
}
