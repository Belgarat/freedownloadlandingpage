'use client'

import { useConfig } from '@/lib/useConfig'
import { CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function ConfigStatus() {
  const { config, loading, error, isDevelopmentMode, isAnalyticsEnabled, isTrackingEnabled } = useConfig()

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading configuration...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Config Error: {error}</span>
        </div>
      </div>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
      <div className="flex items-center space-x-2 mb-2">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="font-semibold">Config Loaded</span>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <span>Development:</span>
          <span className={isDevelopmentMode ? 'text-yellow-400' : 'text-green-400'}>
            {isDevelopmentMode ? 'ON' : 'OFF'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Analytics:</span>
          {isAnalyticsEnabled ? (
            <Eye className="w-3 h-3 text-green-400" />
          ) : (
            <EyeOff className="w-3 h-3 text-red-400" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Tracking:</span>
          {isTrackingEnabled ? (
            <Eye className="w-3 h-3 text-green-400" />
          ) : (
            <EyeOff className="w-3 h-3 text-red-400" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Book:</span>
          <span className="text-blue-400">{config.book.title}</span>
        </div>
      </div>
    </div>
  )
} 