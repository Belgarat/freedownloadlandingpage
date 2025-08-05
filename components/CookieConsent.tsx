'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Settings } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre true, non modificabile
    analytics: false
  })

  useEffect(() => {
    // Controlla se l'utente ha già fatto una scelta
    const savedConsent = localStorage.getItem('cookieConsent')
    if (!savedConsent) {
      setShowBanner(true)
    } else {
      const consent = JSON.parse(savedConsent)
      setPreferences(consent)
      // Abilita analytics se consentito
      if (consent.analytics) {
        window.gtag = window.gtag || function() {}
        window.dataLayer = window.dataLayer || []
      }
    }
  }, [])

  const saveConsent = (analyticsConsent: boolean) => {
    const consent = {
      necessary: true,
      analytics: analyticsConsent
    }
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setPreferences(consent)
    setShowBanner(false)
    
    // Abilita/disabilita analytics
    if (analyticsConsent) {
      // Abilita analytics tracking
      window.gtag = window.gtag || function() {}
      window.dataLayer = window.dataLayer || []
    }
  }

  const acceptAll = () => {
    saveConsent(true)
  }

  const acceptNecessary = () => {
    saveConsent(false)
  }

  const updatePreferences = () => {
    saveConsent(preferences.analytics)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 border-t border-gray-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg">Cookie Policy</h3>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm mb-4 text-gray-300">
          Utilizziamo cookie tecnici per il funzionamento del sito e cookie di analytics 
          per migliorare la tua esperienza. I cookie tecnici sono sempre necessari per il funzionamento del sito.
        </p>

        {showDetails && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-3">Dettagli Cookie</h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Cookie Tecnici (Necessari)</span>
                  <span className="text-green-400">Sempre Attivi</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Gestione sessioni, sicurezza, download file. Non possono essere disabilitati.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Cookie Analytics</span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Consenti</span>
                  </label>
                </div>
                <p className="text-gray-400 text-xs">
                  Analisi del traffico, miglioramento del sito. Puoi disabilitarli in qualsiasi momento.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Personalizza</span>
          </button>
          
          <button
            onClick={acceptNecessary}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-sm"
          >
            Solo Necessari
          </button>
          
          <button
            onClick={acceptAll}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm"
          >
            Accetta Tutti
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Continuando a navigare, accetti la nostra{' '}
          <a href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  )
} 