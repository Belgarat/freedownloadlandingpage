'use client'

import { useConfig } from '@/lib/useConfig'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2, ChevronUp, ChevronDown, X } from 'lucide-react'

export default function ConfigStatus() {
  const { config, loading, error, isDevelopmentMode, isAnalyticsEnabled, isTrackingEnabled } = useConfig()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Only show in development mode
    setIsVisible(isDevelopmentMode)
  }, [isDevelopmentMode])

  if (!isVisible) return null

  const shouldDisableAnalytics = isDevelopmentMode || !isAnalyticsEnabled || !isTrackingEnabled

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        // Minimized state - just a small button
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Show config status"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      ) : (
        // Expanded state - full status panel
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Loading...</span>
                </>
              ) : error ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Config Error</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Config Loaded</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-blue-100 hover:text-white transition-colors"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-blue-100 hover:text-white transition-colors"
                title="Hide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {!loading && !error && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Debug:</span>
                {isDevelopmentMode ? (
                  <CheckCircle className="w-3 h-3 text-green-300" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-300" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Analytics:</span>
                {shouldDisableAnalytics ? (
                  <XCircle className="w-3 h-3 text-red-300" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-green-300" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Tracking:</span>
                {shouldDisableAnalytics ? (
                  <XCircle className="w-3 h-3 text-red-300" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-green-300" />
                )}
              </div>
              {shouldDisableAnalytics && (
                <div className="text-yellow-200 text-xs bg-blue-600/50 rounded px-2 py-1">
                  🔕 Analytics disabled in development
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 