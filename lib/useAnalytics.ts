import { useEffect, useRef, useState } from 'react'

interface AnalyticsEvent {
  action: string
  timestamp: string
  userAgent: string
  referrer: string
  email?: string
  scrollDepth?: number
  timeOnPage?: number
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
      const savedConsent = localStorage.getItem('cookieConsent')
      if (savedConsent) {
        const consent = JSON.parse(savedConsent)
        setAnalyticsConsent(consent.analytics)
      }
    }
  }, [])

  const trackEvent = async (event: Omit<AnalyticsEvent, 'timestamp' | 'userAgent' | 'referrer'>) => {
    // Only track if user has given consent for analytics
    if (!analyticsConsent) return
    
    try {
      await fetch('/api/analytics', {
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
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Track page view on mount
  useEffect(() => {
    if (!hasTrackedPageView) {
      trackEvent({
        action: 'page_view',
      })
      setHasTrackedPageView(true)
    }
  }, [hasTrackedPageView])

  // Track scroll events
  useEffect(() => {
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
  }, [hasTrackedScroll])

  // Track time on page when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime.current
      trackEvent({
        action: 'page_exit',
        timeOnPage,
        scrollDepth: scrollDepth.current,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const trackEmailSubmit = async (email: string) => {
    await trackEvent({
      action: 'email_submitted',
      email,
      timeOnPage: Date.now() - startTime.current,
      scrollDepth: scrollDepth.current,
    })
  }

  return { trackEmailSubmit }
} 