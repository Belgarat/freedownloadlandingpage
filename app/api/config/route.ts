import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    
    // Get active configurations from database
    const [marketingConfig, themeConfig, contentConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig()
    ])

    // For now, we'll use the first active config of each type
    // In the future, we can implement A/B testing logic here
    const config = {
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      // For backward compatibility, we'll keep these as null for now
      // They can be migrated to database later
      book: null,
      seo: null,
      email: null
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

    const config = {
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      book: null,
      seo: null,
      email: null
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
