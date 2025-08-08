'use client'

import { useState, useEffect } from 'react'
import configLoader, { AppConfig, BookConfig, MarketingConfig, ContentConfig, ThemeConfig, SEOConfig, EmailConfig } from './config-loader'

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const loadedConfig = await configLoader.loadConfig()
        setConfig(loadedConfig)
        
        // Start watching for changes in development mode
        if (loadedConfig.theme.development.hotReload) {
          await configLoader.watchConfig((newConfig) => {
            console.log('🔄 Configuration updated via hook')
            setConfig(newConfig)
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration')
        console.error('❌ Error in useConfig:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()

    // Cleanup
    return () => {
      if (config?.theme.development.hotReload) {
        configLoader.stopWatching()
      }
    }
  }, [])

  return {
    config,
    loading,
    error,
    // Helper methods for specific config sections
    book: config?.book || null,
    marketing: config?.marketing || null,
    content: config?.content || null,
    theme: config?.theme || null,
    seo: config?.seo || null,
    email: config?.email || null,
    // Development mode helpers
    isDevelopmentMode: config?.theme?.development?.debug || false,
    isAnalyticsEnabled: config?.theme?.development?.analytics || false,
    isTrackingEnabled: config?.theme?.development?.tracking || false
  }
}

// Specific hooks for individual config sections
export function useBookConfig(): BookConfig | null {
  const { book } = useConfig()
  return book
}

export function useMarketingConfig(): MarketingConfig | null {
  const { marketing } = useConfig()
  return marketing
}

export function useContentConfig(): ContentConfig | null {
  const { content } = useConfig()
  return content
}

export function useThemeConfig(): ThemeConfig | null {
  const { theme } = useConfig()
  return theme
}

export function useSEOConfig(): SEOConfig | null {
  const { seo } = useConfig()
  return seo
}

export function useEmailConfig(): EmailConfig | null {
  const { email } = useConfig()
  return email
}

// Development mode hook
export function useDevelopmentMode() {
  const { isDevelopmentMode, isAnalyticsEnabled, isTrackingEnabled } = useConfig()
  
  return {
    isDevelopmentMode,
    isAnalyticsEnabled,
    isTrackingEnabled,
    shouldTrack: isAnalyticsEnabled && isTrackingEnabled && !isDevelopmentMode
  }
} 