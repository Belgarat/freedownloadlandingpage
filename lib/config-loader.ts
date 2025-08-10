// Server-side only - don't import in browser
if (typeof window !== 'undefined') {
  throw new Error('ConfigLoader is server-side only')
}

import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

export interface BookConfig {
  title: string
  subtitle: string
  author: string
  authorBio: string
  publisher: string
  publisherUrl: string
  publisherTagline: string
  substackName: string
  description: string
  coverImage: string
  rating: number
  reviewCount: number
  publicationDate: string
  isbn: string
  asin: string
  amazonUrl: string
  goodreadsUrl: string
  substackUrl: string
  fileSize: string
  pageCount: number
  language: string
  format: string
  isFree: boolean
  price: number | null
  categories: string[]
  stories: Array<{
    title: string
    description: string
  }>
  awards: Array<{
    title: string
    type: string
  }>
  rankings: {
    kindleStore: string
    sciFiAnthologies: string
    cyberpunkSciFi: string
    cyberpunkBooks: string
  }
  ebook?: {
    pdf?: {
      url: string
      filename: string
      size: string
      uploadedAt: string
    }
    epub?: {
      url: string
      filename: string
      size: string
      uploadedAt: string
    }
    defaultFormat: 'pdf' | 'epub'
  }
}

export interface MarketingConfig {
  cta: {
    primary: {
      text: string
      subtext: string
      loadingText: string
      successText: string
      errorText: string
    }
    social: {
      goodreads: {
        text: string
        url: string
        icon: string
        tracking: string
      }
      amazon: {
        text: string
        url: string
        icon: string
        tracking: string
      }
      publisher: {
        text: string
        url: string
        icon: string
        tracking: string
      }
    }
    newsletter: {
      text: string
      placeholder: string
      url: string
      tracking: string
    }
  }
  modal: {
    success: {
      title: string
      message: string
      buttonText: string
    }
    error: {
      title: string
      message: string
      buttonText: string
    }
  }
  offer: {
    endDate: string
    isLimited: boolean
    limitedText: string
  }
  socialProof: {
    showRating: boolean
    showReviewCount: boolean
    showRankings: boolean
    showAwards: boolean
  }
}

export interface ContentConfig {
  aboutBook: string
  authorBio: string
  stories: Array<{
    title: string
    description: string
    content: string
  }>
  testimonials: Array<{
    text: string
    author: string
    rating: number
    source: string
  }>
  footer: {
    copyright: string
    supportText: string
  }
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    success: string
    error: string
    warning: string
  }
  background?: {
    gradientEnabled?: boolean
    gradientDirection?: string // e.g., 'to bottom right'
  }
  surface?: {
    mode: 'auto' | 'custom'
    bgColor?: string
    bgOpacity?: number // 0-100
    borderColor?: string
    borderOpacity?: number // 0-100
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  layout: {
    type: string
    showCountdown: boolean
    showStories: boolean
    showTestimonials: boolean
    showAwards: boolean
    showRankings: boolean
  }
  spacing: {
    container: string
    section: string
    element: string
  }
  animations: {
    enabled: boolean
    duration: string
    easing: string
  }
  development: {
    analytics: boolean
    tracking: boolean
    debug: boolean
    hotReload: boolean
  }
}

export interface SEOConfig {
  meta: {
    title: string
    description: string
    keywords: string
    author: string
    robots: string
    canonical: string
  }
  openGraph: {
    title: string
    description: string
    type: string
    url: string
    image: string
    siteName: string
  }
  twitter: {
    card: string
    title: string
    description: string
    image: string
  }
  structuredData: {
    book: any
  }
  sitemap: {
    enabled: boolean
    priority: number
    changefreq: string
  }
}

export interface EmailConfig {
  sender: {
    name: string
    email: string
    replyTo: string
  }
  templates: {
    download: {
      subject: string
      html: string
      text: string
      message: string
    }
    followup: {
      subject: string
      html: string
      text: string
    }
  }
  settings: {
    templateExpiryHours: number
    maxRetries: number
    tracking: boolean
  }
}

export interface AppConfig {
  book: BookConfig
  marketing: MarketingConfig
  content: ContentConfig
  theme: ThemeConfig
  seo: SEOConfig
  email: EmailConfig
}

class ConfigLoader {
  private config: AppConfig | null = null
  private watcher: chokidar.FSWatcher | null = null
  private configPath: string
  private onChangeCallbacks: Array<(config: AppConfig) => void> = []

  constructor() {
    this.configPath = path.join(process.cwd(), 'config')
  }

  async loadConfig(): Promise<AppConfig> {
    try {
      const bookConfig = await this.loadJsonFile<BookConfig>('book.json')
      const marketingConfig = await this.loadJsonFile<MarketingConfig>('marketing.json')
      const contentConfig = await this.loadJsonFile<ContentConfig>('content.json')
      const themeConfig = await this.loadJsonFile<ThemeConfig>('theme.json')
      const seoConfig = await this.loadJsonFile<SEOConfig>('seo.json')
      const emailConfig = await this.loadJsonFile<EmailConfig>('email.json')

      this.config = {
        book: bookConfig,
        marketing: marketingConfig,
        content: contentConfig,
        theme: themeConfig,
        seo: seoConfig,
        email: emailConfig
      }

      console.log('✅ Configuration loaded successfully')
      return this.config
    } catch (error) {
      console.error('❌ Error loading configuration:', error)
      throw error
    }
  }

  private async loadJsonFile<T>(filename: string): Promise<T> {
    const filePath = path.join(this.configPath, filename)
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filename}`)
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as T
  }

  getConfig(): AppConfig | null {
    return this.config
  }

  async watchConfig(onChange?: (config: AppConfig) => void): Promise<void> {
    if (onChange) {
      this.onChangeCallbacks.push(onChange)
    }

    if (this.watcher) {
      return // Already watching
    }

    this.watcher = chokidar.watch(path.join(this.configPath, '*.json'), {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    })

    this.watcher.on('change', async (filePath) => {
      console.log(`🔄 Configuration file changed: ${path.basename(filePath)}`)
      
      try {
        await this.loadConfig()
        
        if (this.config) {
          this.onChangeCallbacks.forEach(callback => {
            try {
              callback(this.config!)
            } catch (error) {
              console.error('Error in config change callback:', error)
            }
          })
        }
      } catch (error) {
        console.error('❌ Error reloading configuration:', error)
      }
    })

    this.watcher.on('error', (error) => {
      console.error('❌ File watcher error:', error)
    })

    console.log('👀 Watching for configuration changes...')
  }

  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
      console.log('🛑 Stopped watching configuration files')
    }
  }

  // Helper methods for specific config sections
  getBookConfig(): BookConfig | null {
    return this.config?.book || null
  }

  getMarketingConfig(): MarketingConfig | null {
    return this.config?.marketing || null
  }

  getContentConfig(): ContentConfig | null {
    return this.config?.content || null
  }

  getThemeConfig(): ThemeConfig | null {
    return this.config?.theme || null
  }

  getSEOConfig(): SEOConfig | null {
    return this.config?.seo || null
  }

  getEmailConfig(): EmailConfig | null {
    return this.config?.email || null
  }

  // Development mode helpers
  isDevelopmentMode(): boolean {
    return this.config?.theme?.development?.debug || false
  }

  isAnalyticsEnabled(): boolean {
    return this.config?.theme?.development?.analytics || false
  }

  isTrackingEnabled(): boolean {
    return this.config?.theme?.development?.tracking || false
  }
}

// Singleton instance
const configLoader = new ConfigLoader()

export default configLoader 