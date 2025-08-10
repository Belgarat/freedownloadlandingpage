'use client'

import { useMemo, useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'
import CookieConsent from '@/components/CookieConsent'
import CountdownTimer from '@/components/CountdownTimer'
import SuccessModal from '@/components/landing/SuccessModal'
import BookHeader from '@/components/landing/BookHeader'
import BookCoverSection from '@/components/landing/BookCoverSection'
import BookDetailsSection from '@/components/landing/BookDetailsSection'
import FooterSection from '@/components/landing/FooterSection'
import { useAnalytics } from '@/lib/useAnalytics'
import { useConfig } from '@/lib/useConfig'
import { useABTestByType } from '@/lib/useABTesting'

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // Initialize analytics
  const { trackGoodreadsClick } = useAnalytics()
  const { book, content, marketing, theme } = useConfig()
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

  // A/B Testing hooks con assegnazione persistente
  const { trackConversion: trackHeadlineConversion } = useABTestByType('headline')

  const handleEmailSubmit = async (email: string) => {
    // Traccia conversione per il test A/B headline
    await trackHeadlineConversion(10.50)
    setShowSuccessModal(true)
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
          <BookHeader />

          {/* Main Content - mobile optimized */}
          <main id="main-content" className={`grid ${gridCols} gap-6 lg:gap-12 items-start`}>
            {/* Countdown Timer - Mobile Only (above book cover) */}
            {layout?.showCountdown === true && (
              <div className="lg:hidden">
                <CountdownTimer endDate={offerEndDate} className="mb-4" />
              </div>
            )}
            
            {/* Book Cover Section */}
            <BookCoverSection className={leftColClass} />

            {/* Book Details Section */}
            <BookDetailsSection className={rightColClass} offerEndDate={offerEndDate} />
          </main>

          {/* Footer with imprint logo and info - mobile optimized */}
          <FooterSection />
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        email=""
        onClose={closeSuccessModal}
        onGoodreadsClick={trackGoodreadsClick}
      />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
} 