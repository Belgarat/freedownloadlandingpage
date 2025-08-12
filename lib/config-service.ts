// Configuration Service Layer
// Provides business logic for configuration management

import { getDatabaseAdapter } from './database-config'
import type { 
  MarketingConfig, 
  ThemeConfig, 
  ContentConfig,
  ConfigABTest,
  ConfigUsage,
  ConfigStats,
  ConfigComparison,
  MarketingConfigFormData,
  ThemeConfigFormData,
  ContentConfigFormData
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
      default:
        throw new Error(`Unknown config type: ${type}`)
    }
  }
}

// Export singleton instance
export const configService = new ConfigService()
