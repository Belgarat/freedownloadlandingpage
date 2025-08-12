import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    
    // Get active configurations from database
    const [marketingConfig, themeConfig, contentConfig, bookConfig, seoConfig, emailConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig(),
      configService.getActiveBookConfig(),
      configService.getActiveSEOConfig(),
      configService.getActiveEmailConfig()
    ])

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
    
    if (body.book) {
      const bookResult = await configService.createBookConfig(body.book)
      results.push({ type: 'book', id: bookResult.id })
    }
    
    if (body.seo) {
      const seoResult = await configService.createSEOConfig(body.seo)
      results.push({ type: 'seo', id: seoResult.id })
    }
    
    if (body.email) {
      const emailResult = await configService.createEmailConfig(body.email)
      results.push({ type: 'email', id: emailResult.id })
    }

    console.log('✅ Configuration saved to database:', results)
    
    // Return the updated config
    const [marketingConfig, themeConfig, contentConfig, bookConfig, seoConfig, emailConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig(),
      configService.getActiveBookConfig(),
      configService.getActiveSEOConfig(),
      configService.getActiveEmailConfig()
    ])

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
