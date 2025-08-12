import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/content/active - Get active content config
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'en'
    
    const config = await configService.getActiveContentConfig(language)
    
    if (!config) {
      return NextResponse.json({
        success: false,
        error: `No active content configuration found for language: ${language}`
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching active content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch active content configuration'
    }, { status: 500 })
  }
}

// POST /api/config/content/active - Activate a content config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'Configuration ID is required'
      }, { status: 400 })
    }

    const id = parseInt(body.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    await configService.activateContentConfig(id)
    
    const config = await configService.getContentConfig(id)
    const activeConfig = await configService.getActiveContentConfig(config.language)
    
    return NextResponse.json({
      success: true,
      data: activeConfig,
      message: 'Content configuration activated successfully'
    })
  } catch (error) {
    console.error('❌ Error activating content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to activate content configuration'
    }, { status: 500 })
  }
}
