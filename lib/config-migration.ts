// Configuration Migration Script
// Migrates existing JSON configuration files to database

import fs from 'fs'
import path from 'path'
import { createDatabaseAdapter } from './database-adapter'
import { getDatabaseConfig } from './database-config'
import type { 
  MarketingConfig, 
  ThemeConfig, 
  ContentConfig,
  MarketingConfigFormData,
  ThemeConfigFormData,
  ContentConfigFormData
} from '@/types/config'

interface MigrationResult {
  success: boolean
  migrated: {
    marketing: number
    theme: number
    content: number
  }
  errors: string[]
  backupCreated: boolean
}

export class ConfigMigration {
  private adapter: any
  private configPath: string
  private backupPath: string

  constructor() {
    const dbConfig = getDatabaseConfig()
    this.adapter = createDatabaseAdapter(dbConfig.engine, dbConfig)
    this.configPath = path.join(process.cwd(), 'config')
    this.backupPath = path.join(process.cwd(), 'config-backup')
  }

  async migrate(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migrated: { marketing: 0, theme: 0, content: 0 },
      errors: [],
      backupCreated: false
    }

    try {
      console.log('🔄 Starting configuration migration...')

      // Step 1: Create backup
      await this.createBackup()
      result.backupCreated = true

      // Step 2: Migrate marketing config
      try {
        await this.migrateMarketingConfig()
        result.migrated.marketing = 1
        console.log('✅ Marketing config migrated')
      } catch (error) {
        result.errors.push(`Marketing config: ${error instanceof Error ? error.message : 'Unknown error'}`)
        console.error('❌ Marketing config migration failed:', error)
      }

      // Step 3: Migrate theme config
      try {
        await this.migrateThemeConfig()
        result.migrated.theme = 1
        console.log('✅ Theme config migrated')
      } catch (error) {
        result.errors.push(`Theme config: ${error instanceof Error ? error.message : 'Unknown error'}`)
        console.error('❌ Theme config migration failed:', error)
      }

      // Step 4: Migrate content config
      try {
        await this.migrateContentConfig()
        result.migrated.content = 1
        console.log('✅ Content config migrated')
      } catch (error) {
        result.errors.push(`Content config: ${error instanceof Error ? error.message : 'Unknown error'}`)
        console.error('❌ Content config migration failed:', error)
      }

      // Step 5: Validate migration
      await this.validateMigration()

      result.success = result.errors.length === 0
      console.log('🎉 Configuration migration completed!')
      
      return result

    } catch (error) {
      result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('❌ Migration failed:', error)
      return result
    }
  }

  private async createBackup(): Promise<void> {
    console.log('📦 Creating backup of JSON files...')
    
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true })
    }

    const files = ['marketing.json', 'theme.json', 'content.json']
    
    for (const file of files) {
      const sourcePath = path.join(this.configPath, file)
      const backupPath = path.join(this.backupPath, file)
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupPath)
        console.log(`  - Backed up ${file}`)
      }
    }
  }

  private async migrateMarketingConfig(): Promise<void> {
    const filePath = path.join(this.configPath, 'marketing.json')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('marketing.json not found')
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    
    // Check if config already exists
    const existingConfigs = await this.adapter.getMarketingConfigs()
    const defaultConfig = existingConfigs.find(c => c.is_default)
    
    if (defaultConfig) {
      // Update existing default config
      await this.adapter.updateMarketingConfig(defaultConfig.id!, {
        cta_config: jsonData.cta,
        modal_config: jsonData.modal,
        offer_config: jsonData.offer,
        social_proof_config: jsonData.socialProof
      })
      console.log('  - Updated existing marketing config')
    } else {
      // Create new config
      await this.adapter.createMarketingConfig({
        name: 'Migrated Marketing Config',
        description: 'Migrated from marketing.json',
        cta_config: jsonData.cta,
        modal_config: jsonData.modal,
        offer_config: jsonData.offer,
        social_proof_config: jsonData.socialProof,
        is_active: true,
        is_default: true
      })
      console.log('  - Created new marketing config')
    }
  }

  private async migrateThemeConfig(): Promise<void> {
    const filePath = path.join(this.configPath, 'theme.json')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('theme.json not found')
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    
    // Check if config already exists
    const existingConfigs = await this.adapter.getThemeConfigs()
    const defaultConfig = existingConfigs.find(c => c.is_default)
    
    if (defaultConfig) {
      // Update existing default config
      await this.adapter.updateThemeConfig(defaultConfig.id!, {
        colors: jsonData.colors,
        fonts: jsonData.fonts,
        layout: jsonData.layout,
        spacing: jsonData.spacing,
        animations: jsonData.animations,
        development: jsonData.development,
        surface: jsonData.surface
      })
      console.log('  - Updated existing theme config')
    } else {
      // Create new config
      await this.adapter.createThemeConfig({
        name: 'Migrated Theme Config',
        description: 'Migrated from theme.json',
        colors: jsonData.colors,
        fonts: jsonData.fonts,
        layout: jsonData.layout,
        spacing: jsonData.spacing,
        animations: jsonData.animations,
        development: jsonData.development,
        surface: jsonData.surface,
        is_active: true,
        is_default: true
      })
      console.log('  - Created new theme config')
    }
  }

  private async migrateContentConfig(): Promise<void> {
    const filePath = path.join(this.configPath, 'content.json')
    
    if (!fs.existsSync(filePath)) {
      throw new Error('content.json not found')
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    
    // Check if config already exists
    const existingConfigs = await this.adapter.getContentConfigs()
    const defaultConfig = existingConfigs.find(c => c.is_default && c.language === 'en')
    
    if (defaultConfig) {
      // Update existing default config
      await this.adapter.updateContentConfig(defaultConfig.id!, {
        about_book: jsonData.aboutBook,
        author_bio: jsonData.authorBio,
        stories: jsonData.stories,
        testimonials: jsonData.testimonials,
        footer: jsonData.footer
      })
      console.log('  - Updated existing content config')
    } else {
      // Create new config
      await this.adapter.createContentConfig({
        language: 'en',
        name: 'Migrated Content Config',
        about_book: jsonData.aboutBook,
        author_bio: jsonData.authorBio,
        stories: jsonData.stories,
        testimonials: jsonData.testimonials,
        footer: jsonData.footer,
        is_active: true,
        is_default: true
      })
      console.log('  - Created new content config')
    }
  }

  private async validateMigration(): Promise<void> {
    console.log('🔍 Validating migration...')
    
    // Check marketing config
    const marketingConfig = await this.adapter.getActiveMarketingConfig()
    if (!marketingConfig) {
      throw new Error('No active marketing config found')
    }
    console.log('  - Marketing config: ✅')

    // Check theme config
    const themeConfig = await this.adapter.getActiveThemeConfig()
    if (!themeConfig) {
      throw new Error('No active theme config found')
    }
    console.log('  - Theme config: ✅')

    // Check content config
    const contentConfig = await this.adapter.getActiveContentConfig('en')
    if (!contentConfig) {
      throw new Error('No active content config found')
    }
    console.log('  - Content config: ✅')
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rolling back migration...')
    
    if (!fs.existsSync(this.backupPath)) {
      throw new Error('Backup not found')
    }

    const files = ['marketing.json', 'theme.json', 'content.json']
    
    for (const file of files) {
      const backupPath = path.join(this.backupPath, file)
      const sourcePath = path.join(this.configPath, file)
      
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, sourcePath)
        console.log(`  - Restored ${file}`)
      }
    }

    console.log('✅ Rollback completed')
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up backup files...')
    
    if (fs.existsSync(this.backupPath)) {
      fs.rmSync(this.backupPath, { recursive: true, force: true })
      console.log('  - Backup directory removed')
    }
  }
}

// CLI usage
if (require.main === module) {
  const migration = new ConfigMigration()
  
  const command = process.argv[2]
  
  switch (command) {
    case 'migrate':
      migration.migrate()
        .then(result => {
          console.log('\n📊 Migration Results:')
          console.log(`Success: ${result.success}`)
          console.log(`Migrated: ${JSON.stringify(result.migrated)}`)
          console.log(`Backup created: ${result.backupCreated}`)
          if (result.errors.length > 0) {
            console.log(`Errors: ${result.errors.join(', ')}`)
          }
          process.exit(result.success ? 0 : 1)
        })
        .catch(error => {
          console.error('❌ Migration failed:', error)
          process.exit(1)
        })
      break
      
    case 'rollback':
      migration.rollback()
        .then(() => {
          console.log('✅ Rollback completed successfully')
          process.exit(0)
        })
        .catch(error => {
          console.error('❌ Rollback failed:', error)
          process.exit(1)
        })
      break
      
    case 'cleanup':
      migration.cleanup()
        .then(() => {
          console.log('✅ Cleanup completed successfully')
          process.exit(0)
        })
        .catch(error => {
          console.error('❌ Cleanup failed:', error)
          process.exit(1)
        })
      break
      
    default:
      console.log('Usage:')
      console.log('  npm run config:migrate   - Migrate JSON to database')
      console.log('  npm run config:rollback  - Rollback to JSON files')
      console.log('  npm run config:cleanup   - Clean up backup files')
      process.exit(1)
  }
}
