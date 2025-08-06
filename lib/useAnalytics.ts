import { useEffect, useRef, useState } from 'react'

interface AnalyticsEvent {
  action: string
  timestamp: string
  userAgent: string
  referrer: string
  email?: string
  scrollDepth?: number
  timeOnPage?: number
  externalLink?: string
}

export const useAnalytics = () => {
  const [hasTrackedPageView, setHasTrackedPageView] = useState(false)
  const [hasTrackedScroll, setHasTrackedScroll] = useState(false)
  const [analyticsConsent, setAnalyticsConsent] = useState(false)
  const startTime = useRef(Date.now())
  const scrollDepth = useRef(0)

  // Check for analytics consent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkConsent = () => {
        const savedConsent = localStorage.getItem('cookieConsent')
        if (savedConsent) {
          const consent = JSON.parse(savedConsent)
          setAnalyticsConsent(consent.analytics)
        } else {
          setAnalyticsConsent(false)
        }
      }
      
      // Check initial consent
      checkConsent()
      
      // Listen for consent changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cookieConsent') {
          checkConsent()
        }
      }
      
      window.addEventListener('storage', handleStorageChange)
      
      // Also listen for custom events (for same-tab updates)
      const handleConsentChange = () => {
        checkConsent()
      }
      
      window.addEventListener('consentChanged', handleConsentChange)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('consentChanged', handleConsentChange)
      }
    }
  }, [])

  const trackAnonymousEvent = async (action: string) => {
    // Always track anonymously (GDPR compliant)
    try {
      const response = await fetch('/api/analytics/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      
      if (!response.ok) {
        console.error('Anonymous analytics API error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Anonymous analytics tracking error:', error)
    }
  }

  const trackEvent = async (event: Omit<AnalyticsEvent, 'timestamp' | 'userAgent' | 'referrer'>) => {
    // Only track if user has given consent for analytics
    if (!analyticsConsent) return
    
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      })
      
      if (!response.ok) {
        console.error('Analytics API error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Track page view on mount
  useEffect(() => {
    if (!hasTrackedPageView) {
      // Always track anonymously (GDPR compliant)
      trackAnonymousEvent('page_view')
      
      // Track with consent if available
      if (analyticsConsent) {
        trackEvent({
          action: 'page_view',
        })
      }
      setHasTrackedPageView(true)
    }
  }, [hasTrackedPageView, analyticsConsent])

  // Track scroll events
  useEffect(() => {
    if (!analyticsConsent) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      scrollDepth.current = Math.max(scrollDepth.current, scrollPercent)

      // Track when user scrolls to bottom (90% or more)
      if (scrollPercent >= 90 && !hasTrackedScroll) {
        trackEvent({
          action: 'scroll_to_bottom',
          scrollDepth: scrollPercent,
          timeOnPage: Date.now() - startTime.current,
        })
        setHasTrackedScroll(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasTrackedScroll, analyticsConsent])

  // Track time on page when user leaves
  useEffect(() => {
    if (!analyticsConsent) return

    let hasTrackedExit = false

    const trackExit = () => {
      if (hasTrackedExit) return
      hasTrackedExit = true
      
      const timeOnPage = Date.now() - startTime.current
      trackEvent({
        action: 'page_exit',
        timeOnPage,
        scrollDepth: scrollDepth.current,
      })
    }

    // Track when page is about to unload (more reliable than beforeunload)
    const handlePageHide = () => {
      trackExit()
    }

    // Fallback to beforeunload
    const handleBeforeUnload = () => {
      trackExit()
    }

    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [analyticsConsent])

  const trackEmailSubmit = async (email: string) => {
    // Always track anonymously (GDPR compliant)
    trackAnonymousEvent('email_submitted')
    
    // Track with consent if available
    if (analyticsConsent) {
      await trackEvent({
        action: 'email_submitted',
        email,
        timeOnPage: Date.now() - startTime.current,
        scrollDepth: scrollDepth.current,
      })
    }
  }

  const trackGoodreadsClick = async () => {
    // Always track anonymously (GDPR compliant)
    trackAnonymousEvent('goodreads_click')
    
    // Track with consent if available
    if (analyticsConsent) {
      await trackEvent({
        action: 'goodreads_click',
        externalLink: 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns',
        timeOnPage: Date.now() - startTime.current,
        scrollDepth: scrollDepth.current,
      })
    }
  }

  const trackSubstackClick = async () => {
    // Always track anonymously (GDPR compliant)
    trackAnonymousEvent('substack_click')
    
    // Track with consent if available
    if (analyticsConsent) {
      await trackEvent({
        action: 'substack_click',
        externalLink: 'https://aroundscifi.substack.com/',
        timeOnPage: Date.now() - startTime.current,
        scrollDepth: scrollDepth.current,
      })
    }
  }

  const trackPublisherClick = async () => {
    // Always track anonymously (GDPR compliant)
    trackAnonymousEvent('publisher_click')
    
    // Track with consent if available
    if (analyticsConsent) {
      await trackEvent({
        action: 'publisher_click',
        externalLink: 'https://37indielab.com/',
        timeOnPage: Date.now() - startTime.current,
        scrollDepth: scrollDepth.current,
      })
    }
  }

  return { trackEmailSubmit, trackGoodreadsClick, trackSubstackClick, trackPublisherClick }
} 