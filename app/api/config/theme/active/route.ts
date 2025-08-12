import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/theme/active - Get active theme config
export async function GET() {
  try {
    const config = await configService.getActiveThemeConfig()
    
    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'No active theme configuration found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching active theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch active theme configuration'
    }, { status: 500 })
  }
}

// POST /api/config/theme/active - Activate a theme config
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

    await configService.activateThemeConfig(id)
    
    const activeConfig = await configService.getActiveThemeConfig()
    
    return NextResponse.json({
      success: true,
      data: activeConfig,
      message: 'Theme configuration activated successfully'
    })
  } catch (error) {
    console.error('❌ Error activating theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to activate theme configuration'
    }, { status: 500 })
  }
}
