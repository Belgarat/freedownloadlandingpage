import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/marketing/active - Get active marketing config
export async function GET() {
  try {
    const config = await configService.getActiveMarketingConfig()
    
    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'No active marketing configuration found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching active marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch active marketing configuration'
    }, { status: 500 })
  }
}

// POST /api/config/marketing/active - Activate a marketing config
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

    await configService.activateMarketingConfig(id)
    
    const activeConfig = await configService.getActiveMarketingConfig()
    
    return NextResponse.json({
      success: true,
      data: activeConfig,
      message: 'Marketing configuration activated successfully'
    })
  } catch (error) {
    console.error('❌ Error activating marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to activate marketing configuration'
    }, { status: 500 })
  }
}
