'use client'

import { useConfig } from '@/lib/useConfig'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ConfigStatus() {
  const { config, loading, error, isDevelopmentMode, isAnalyticsEnabled, isTrackingEnabled } = useConfig()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development mode
    setIsVisible(isDevelopmentMode)
  }, [isDevelopmentMode])

  if (!isVisible) return null

  const shouldDisableAnalytics = isDevelopmentMode || !isAnalyticsEnabled || !isTrackingEnabled

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading configuration...</span>
          </>
        ) : error ? (
          <>
            <XCircle className="w-4 h-4" />
            <span>Config Error</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Config Loaded</span>
          </>
        )}
      </div>
      
      {!loading && !error && (
        <div className="mt-2 text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <span>Debug:</span>
            {isDevelopmentMode ? (
              <CheckCircle className="w-3 h-3 text-green-300" />
            ) : (
              <XCircle className="w-3 h-3 text-red-300" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>Analytics:</span>
            {shouldDisableAnalytics ? (
              <XCircle className="w-3 h-3 text-red-300" />
            ) : (
              <CheckCircle className="w-3 h-3 text-green-300" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>Tracking:</span>
            {shouldDisableAnalytics ? (
              <XCircle className="w-3 h-3 text-red-300" />
            ) : (
              <CheckCircle className="w-3 h-3 text-green-300" />
            )}
          </div>
          {shouldDisableAnalytics && (
            <div className="text-yellow-200 text-xs">
              🔕 Analytics disabled in development
            </div>
          )}
        </div>
      )}
    </div>
  )
} 