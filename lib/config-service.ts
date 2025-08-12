// Configuration Service Layer
// Provides business logic for configuration management

import { getDatabaseAdapter } from './database-config'
import type { 
  MarketingConfig, 
  ThemeConfig, 
  ContentConfig,
  BookConfig,
  SEOConfig,
  EmailConfig,
  ConfigABTest,
  ConfigUsage,
  ConfigStats,
  ConfigComparison,
  MarketingConfigFormData,
  ThemeConfigFormData,
  ContentConfigFormData,
  BookConfigFormData,
  SEOConfigFormData,
  EmailConfigFormData
} from '@/types/config'

export class ConfigService {
  private adapter = getDatabaseAdapter()

  // Marketing Configuration Methods
  async getMarketingConfigs(): Promise<MarketingConfig[]> {
    return this.adapter.getMarketingConfigs()
  }

  async getMarketingConfig(id: number): Promise<MarketingConfig> {
    return this.adapter.getMarketingConfig(id)
  }

  async createMarketingConfig(data: MarketingConfigFormData): Promise<MarketingConfig> {
    // If this is the first config, make it active and default
    const existingConfigs = await this.adapter.getMarketingConfigs()
    const isFirst = existingConfigs.length === 0

    return this.adapter.createMarketingConfig({
      name: data.name,
      description: data.description,
      cta_config: data.cta_config,
      modal_config: data.modal_config,
      offer_config: data.offer_config,
      social_proof_config: data.social_proof_config,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateMarketingConfig(id: number, data: Partial<MarketingConfigFormData>): Promise<MarketingConfig> {
    return this.adapter.updateMarketingConfig(id, data)
  }

  async deleteMarketingConfig(id: number): Promise<void> {
    const config = await this.adapter.getMarketingConfig(id)
    
    // Don't allow deletion of the last active config
    if (config.is_active) {
      const allConfigs = await this.adapter.getMarketingConfigs()
      const activeConfigs = allConfigs.filter(c => c.is_active)
      
      if (activeConfigs.length <= 1) {
        throw new Error('Cannot delete the last active marketing configuration')
      }
    }

    await this.adapter.deleteMarketingConfig(id)
  }

  async activateMarketingConfig(id: number): Promise<void> {
    // Deactivate all other configs
    const allConfigs = await this.adapter.getMarketingConfigs()
    
    for (const config of allConfigs) {
      if (config.id !== id) {
        await this.adapter.updateMarketingConfig(config.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateMarketingConfig(id, { is_active: true })
  }

  async getActiveMarketingConfig(): Promise<MarketingConfig | null> {
    return this.adapter.getActiveMarketingConfig()
  }

  // Theme Configuration Methods
  async getThemeConfigs(): Promise<ThemeConfig[]> {
    return this.adapter.getThemeConfigs()
  }

  async getThemeConfig(id: number): Promise<ThemeConfig> {
    return this.adapter.getThemeConfig(id)
  }

  async createThemeConfig(data: ThemeConfigFormData): Promise<ThemeConfig> {
    // If this is the first config, make it active and default
    const existingConfigs = await this.adapter.getThemeConfigs()
    const isFirst = existingConfigs.length === 0

    return this.adapter.createThemeConfig({
      name: data.name,
      description: data.description,
      colors: data.colors,
      fonts: data.fonts,
      layout: data.layout,
      spacing: data.spacing,
      animations: data.animations,
      development: data.development,
      surface: data.surface,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateThemeConfig(id: number, data: Partial<ThemeConfigFormData>): Promise<ThemeConfig> {
    return this.adapter.updateThemeConfig(id, data)
  }

  async deleteThemeConfig(id: number): Promise<void> {
    const config = await this.adapter.getThemeConfig(id)
    
    // Don't allow deletion of the last active config
    if (config.is_active) {
      const allConfigs = await this.adapter.getThemeConfigs()
      const activeConfigs = allConfigs.filter(c => c.is_active)
      
      if (activeConfigs.length <= 1) {
        throw new Error('Cannot delete the last active theme configuration')
      }
    }

    await this.adapter.deleteThemeConfig(id)
  }

  async activateThemeConfig(id: number): Promise<void> {
    // Deactivate all other configs
    const allConfigs = await this.adapter.getThemeConfigs()
    
    for (const config of allConfigs) {
      if (config.id !== id) {
        await this.adapter.updateThemeConfig(config.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateThemeConfig(id, { is_active: true })
  }

  async getActiveThemeConfig(): Promise<ThemeConfig | null> {
    return this.adapter.getActiveThemeConfig()
  }

  // Content Configuration Methods
  async getContentConfigs(): Promise<ContentConfig[]> {
    return this.adapter.getContentConfigs()
  }

  async getContentConfig(id: number): Promise<ContentConfig> {
    return this.adapter.getContentConfig(id)
  }

  async createContentConfig(data: ContentConfigFormData): Promise<ContentConfig> {
    // If this is the first config for this language, make it active and default
    const existingConfigs = await this.adapter.getContentConfigs()
    const languageConfigs = existingConfigs.filter(c => c.language === data.language)
    const isFirst = languageConfigs.length === 0

    return this.adapter.createContentConfig({
      language: data.language,
      name: data.name,
      about_book: data.about_book,
      author_bio: data.author_bio,
      stories: data.stories,
      testimonials: data.testimonials,
      footer: data.footer,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateContentConfig(id: number, data: Partial<ContentConfigFormData>): Promise<ContentConfig> {
    return this.adapter.updateContentConfig(id, data)
  }

  async deleteContentConfig(id: number): Promise<void> {
    const config = await this.adapter.getContentConfig(id)
    
    // Don't allow deletion of the last active config for this language
    if (config.is_active) {
      const allConfigs = await this.adapter.getContentConfigs()
      const languageConfigs = allConfigs.filter(c => c.language === config.language && c.is_active)
      
      if (languageConfigs.length <= 1) {
        throw new Error(`Cannot delete the last active content configuration for language: ${config.language}`)
      }
    }

    await this.adapter.deleteContentConfig(id)
  }

  async activateContentConfig(id: number): Promise<void> {
    const config = await this.adapter.getContentConfig(id)
    
    // Deactivate all other configs for this language
    const allConfigs = await this.adapter.getContentConfigs()
    const languageConfigs = allConfigs.filter(c => c.language === config.language)
    
    for (const langConfig of languageConfigs) {
      if (langConfig.id !== id) {
        await this.adapter.updateContentConfig(langConfig.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateContentConfig(id, { is_active: true })
  }

  async getActiveContentConfig(language: string = 'en'): Promise<ContentConfig | null> {
    return this.adapter.getActiveContentConfig(language)
  }

  // A/B Testing Methods
  async createConfigABTest(data: Omit<ConfigABTest, 'id' | 'created_at'>): Promise<ConfigABTest> {
    // Validate that both configs exist and are of the same type
    const configA = await this.getConfigById(data.config_a_id, data.config_type)
    const configB = await this.getConfigById(data.config_b_id, data.config_type)
    
    if (!configA || !configB) {
      throw new Error('One or both configurations not found')
    }

    return this.adapter.createConfigABTest(data)
  }

  async getConfigABTests(): Promise<ConfigABTest[]> {
    return this.adapter.getConfigABTests()
  }

  async getConfigABTest(id: number): Promise<ConfigABTest> {
    return this.adapter.getConfigABTest(id)
  }

  async updateConfigABTest(id: number, data: Partial<ConfigABTest>): Promise<ConfigABTest> {
    return this.adapter.updateConfigABTest(id, data)
  }

  async deleteConfigABTest(id: number): Promise<void> {
    await this.adapter.deleteConfigABTest(id)
  }

  async getConfigComparison(testId: number): Promise<ConfigComparison> {
    return this.adapter.getConfigComparison(testId)
  }

  // Usage Tracking Methods
  async trackConfigUsage(data: Omit<ConfigUsage, 'id' | 'created_at' | 'updated_at'>): Promise<ConfigUsage> {
    return this.adapter.trackConfigUsage(data)
  }

  async getConfigStats(configId: number, configType: string): Promise<ConfigStats> {
    return this.adapter.getConfigStats(configId, configType)
  }

  // Helper Methods
  private async getConfigById(id: number, type: string): Promise<any> {
    switch (type) {
      case 'marketing':
        return this.adapter.getMarketingConfig(id)
      case 'theme':
        return this.adapter.getThemeConfig(id)
      case 'content':
        return this.adapter.getContentConfig(id)
      default:
        throw new Error(`Unknown config type: ${type}`)
    }
  }

  // Visitor Assignment Methods
  async assignConfigToVisitor(visitorId: string, configType: string): Promise<number> {
    // Get active config for the type
    let activeConfig: any = null
    
    switch (configType) {
      case 'marketing':
        activeConfig = await this.getActiveMarketingConfig()
        break
      case 'theme':
        activeConfig = await this.getActiveThemeConfig()
        break
      case 'content':
        activeConfig = await this.getActiveContentConfig('en')
        break
      default:
        throw new Error(`Unknown config type: ${configType}`)
    }

    if (!activeConfig) {
      throw new Error(`No active ${configType} configuration found`)
    }

    // Track usage
    await this.trackConfigUsage({
      config_type: configType as any,
      config_id: activeConfig.id,
      visitor_id: visitorId,
      page_view: 1,
      email_submission: 0,
      download_request: 0,
      download_completed: 0
    })

    return activeConfig.id
  }

  // Bulk Operations
  async duplicateConfig(id: number, type: string, newName: string): Promise<any> {
    let config: any = null
    
    switch (type) {
      case 'marketing':
        config = await this.getMarketingConfig(id)
        return this.createMarketingConfig({
          name: newName,
          description: `${config.description} (Copy)`,
          cta_config: config.cta_config,
          modal_config: config.modal_config,
          offer_config: config.offer_config,
          social_proof_config: config.social_proof_config
        })
      case 'theme':
        config = await this.getThemeConfig(id)
        return this.createThemeConfig({
          name: newName,
          description: `${config.description} (Copy)`,
          colors: config.colors,
          fonts: config.fonts,
          layout: config.layout,
          spacing: config.spacing,
          animations: config.animations,
          development: config.development,
          surface: config.surface
        })
      case 'content':
        config = await this.getContentConfig(id)
        return this.createContentConfig({
          language: config.language,
          name: newName,
          about_book: config.about_book,
          author_bio: config.author_bio,
          stories: config.stories,
          testimonials: config.testimonials,
          footer: config.footer
        })
      default:
        throw new Error(`Unknown config type: ${type}`)
    }
  }

  // Analytics Methods
  async getConfigAnalytics(type: string, timeRange: string = '7d'): Promise<any> {
    const configs = await this.getConfigsByType(type)
    const analytics = []

    for (const config of configs) {
      const stats = await this.getConfigStats(config.id!, type)
      analytics.push({
        config,
        stats,
        timeRange
      })
    }

    return analytics
  }

  private async getConfigsByType(type: string): Promise<any[]> {
    switch (type) {
      case 'marketing':
        return this.getMarketingConfigs()
      case 'theme':
        return this.getThemeConfigs()
      case 'content':
        return this.getContentConfigs()
      case 'book':
        return this.getBookConfigs()
      case 'seo':
        return this.getSEOConfigs()
      case 'email':
        return this.getEmailConfigs()
      default:
        throw new Error(`Unknown config type: ${type}`)
    }
  }

  // Book Configuration Methods
  async getBookConfigs(): Promise<BookConfig[]> {
    return this.adapter.getBookConfigs()
  }

  async getBookConfig(id: number): Promise<BookConfig> {
    return this.adapter.getBookConfig(id)
  }

  async createBookConfig(data: BookConfigFormData): Promise<BookConfig> {
    // If this is the first config, make it active and default
    const existingConfigs = await this.adapter.getBookConfigs()
    const isFirst = existingConfigs.length === 0

    return this.adapter.createBookConfig({
      name: data.name,
      description: data.description,
      title: data.title,
      subtitle: data.subtitle,
      author: data.author,
      author_bio: data.author_bio,
      publisher: data.publisher,
      publisher_url: data.publisher_url,
      publisher_tagline: data.publisher_tagline,
      substack_name: data.substack_name,
      description_content: data.description_content,
      cover_image: data.cover_image,
      rating: data.rating,
      review_count: data.review_count,
      publication_date: data.publication_date,
      isbn: data.isbn,
      asin: data.asin,
      amazon_url: data.amazon_url,
      goodreads_url: data.goodreads_url,
      substack_url: data.substack_url,
      file_size: data.file_size,
      page_count: data.page_count,
      language: data.language,
      format: data.format,
      is_free: data.is_free,
      price: data.price,
      categories: data.categories,
      stories: data.stories,
      awards: data.awards,
      rankings: data.rankings,
      ebook: data.ebook,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateBookConfig(id: number, data: Partial<BookConfigFormData>): Promise<BookConfig> {
    return this.adapter.updateBookConfig(id, data)
  }

  async deleteBookConfig(id: number): Promise<void> {
    const config = await this.adapter.getBookConfig(id)
    
    // Don't allow deletion of the last active config
    if (config.is_active) {
      const allConfigs = await this.adapter.getBookConfigs()
      const activeConfigs = allConfigs.filter(c => c.is_active)
      
      if (activeConfigs.length <= 1) {
        throw new Error('Cannot delete the last active book configuration')
      }
    }

    await this.adapter.deleteBookConfig(id)
  }

  async activateBookConfig(id: number): Promise<void> {
    // Deactivate all other configs
    const allConfigs = await this.adapter.getBookConfigs()
    
    for (const config of allConfigs) {
      if (config.id !== id) {
        await this.adapter.updateBookConfig(config.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateBookConfig(id, { is_active: true })
  }

  async getActiveBookConfig(): Promise<BookConfig | null> {
    return this.adapter.getActiveBookConfig()
  }

  // SEO Configuration Methods
  async getSEOConfigs(): Promise<SEOConfig[]> {
    return this.adapter.getSEOConfigs()
  }

  async getSEOConfig(id: number): Promise<SEOConfig> {
    return this.adapter.getSEOConfig(id)
  }

  async createSEOConfig(data: SEOConfigFormData): Promise<SEOConfig> {
    // If this is the first config, make it active and default
    const existingConfigs = await this.adapter.getSEOConfigs()
    const isFirst = existingConfigs.length === 0

    return this.adapter.createSEOConfig({
      name: data.name,
      description: data.description,
      meta: data.meta,
      openGraph: data.openGraph,
      twitter: data.twitter,
      structured_data: data.structured_data,
      sitemap: data.sitemap,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateSEOConfig(id: number, data: Partial<SEOConfigFormData>): Promise<SEOConfig> {
    return this.adapter.updateSEOConfig(id, data)
  }

  async deleteSEOConfig(id: number): Promise<void> {
    const config = await this.adapter.getSEOConfig(id)
    
    // Don't allow deletion of the last active config
    if (config.is_active) {
      const allConfigs = await this.adapter.getSEOConfigs()
      const activeConfigs = allConfigs.filter(c => c.is_active)
      
      if (activeConfigs.length <= 1) {
        throw new Error('Cannot delete the last active SEO configuration')
      }
    }

    await this.adapter.deleteSEOConfig(id)
  }

  async activateSEOConfig(id: number): Promise<void> {
    // Deactivate all other configs
    const allConfigs = await this.adapter.getSEOConfigs()
    
    for (const config of allConfigs) {
      if (config.id !== id) {
        await this.adapter.updateSEOConfig(config.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateSEOConfig(id, { is_active: true })
  }

  async getActiveSEOConfig(): Promise<SEOConfig | null> {
    return this.adapter.getActiveSEOConfig()
  }

  // Email Configuration Methods
  async getEmailConfigs(): Promise<EmailConfig[]> {
    return this.adapter.getEmailConfigs()
  }

  async getEmailConfig(id: number): Promise<EmailConfig> {
    return this.adapter.getEmailConfig(id)
  }

  async createEmailConfig(data: EmailConfigFormData): Promise<EmailConfig> {
    // If this is the first config, make it active and default
    const existingConfigs = await this.adapter.getEmailConfigs()
    const isFirst = existingConfigs.length === 0

    return this.adapter.createEmailConfig({
      name: data.name,
      description: data.description,
      sender: data.sender,
      templates: data.templates,
      settings: data.settings,
      is_active: isFirst,
      is_default: isFirst
    })
  }

  async updateEmailConfig(id: number, data: Partial<EmailConfigFormData>): Promise<EmailConfig> {
    return this.adapter.updateEmailConfig(id, data)
  }

  async deleteEmailConfig(id: number): Promise<void> {
    const config = await this.adapter.getEmailConfig(id)
    
    // Don't allow deletion of the last active config
    if (config.is_active) {
      const allConfigs = await this.adapter.getEmailConfigs()
      const activeConfigs = allConfigs.filter(c => c.is_active)
      
      if (activeConfigs.length <= 1) {
        throw new Error('Cannot delete the last active email configuration')
      }
    }

    await this.adapter.deleteEmailConfig(id)
  }

  async activateEmailConfig(id: number): Promise<void> {
    // Deactivate all other configs
    const allConfigs = await this.adapter.getEmailConfigs()
    
    if (allConfigs.length === 0) return
    
    for (const config of allConfigs) {
      if (config.id !== id) {
        await this.adapter.updateEmailConfig(config.id!, { is_active: false })
      }
    }
    
    // Activate the selected config
    await this.adapter.updateEmailConfig(id, { is_active: true })
  }

  async getActiveEmailConfig(): Promise<EmailConfig | null> {
    return this.adapter.getActiveEmailConfig()
  }
}

// Export singleton instance
export const configService = new ConfigService()
