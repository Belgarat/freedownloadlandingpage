import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'
import configLoader from '@/lib/config-loader'

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    
    // Get active configurations from database
    const [marketingConfig, themeConfig, contentConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig()
    ])

    // For backward compatibility, load book, seo, and email from JSON files
    // until they are migrated to database
    let bookConfig = null
    let seoConfig = null
    let emailConfig = null
    
    try {
      const jsonConfig = await configLoader.loadConfig()
      bookConfig = jsonConfig.book
      seoConfig = jsonConfig.seo
      emailConfig = jsonConfig.email
    } catch (error) {
      console.warn('Failed to load JSON config for backward compatibility:', error)
    }

    const config = {
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      book: bookConfig,
      seo: seoConfig,
      email: emailConfig
    }
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error loading config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load configuration'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const configService = new ConfigService()
    
    // Save configurations to database
    const results = []
    
    if (body.marketing) {
      const marketingResult = await configService.createMarketingConfig(body.marketing)
      results.push({ type: 'marketing', id: marketingResult.id })
    }
    
    if (body.theme) {
      const themeResult = await configService.createThemeConfig(body.theme)
      results.push({ type: 'theme', id: themeResult.id })
    }
    
    if (body.content) {
      const contentResult = await configService.createContentConfig(body.content)
      results.push({ type: 'content', id: contentResult.id })
    }

    console.log('✅ Configuration saved to database:', results)
    
    // Return the updated config
    const [marketingConfig, themeConfig, contentConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig()
    ])

    // For backward compatibility, load book, seo, and email from JSON files
    let bookConfig = null
    let seoConfig = null
    let emailConfig = null
    
    try {
      const jsonConfig = await configLoader.loadConfig()
      bookConfig = jsonConfig.book
      seoConfig = jsonConfig.seo
      emailConfig = jsonConfig.email
    } catch (error) {
      console.warn('Failed to load JSON config for backward compatibility:', error)
    }

    const config = {
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      book: bookConfig,
      seo: seoConfig,
      email: emailConfig
    }
    
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      data: config
    })
  } catch (error) {
    console.error('❌ Error saving config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save configuration'
    }, { status: 500 })
  }
}
