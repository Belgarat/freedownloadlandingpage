import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// POST /api/config/usage - Track configuration usage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.config_type || !body.config_id || !body.visitor_id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: config_type, config_id, visitor_id'
      }, { status: 400 })
    }

    const usage = await configService.trackConfigUsage({
      config_type: body.config_type,
      config_id: body.config_id,
      visitor_id: body.visitor_id,
      page_view: body.page_view || 0,
      email_submission: body.email_submission || 0,
      download_request: body.download_request || 0,
      download_completed: body.download_completed || 0
    })
    
    return NextResponse.json({
      success: true,
      data: usage,
      message: 'Usage tracked successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error tracking config usage:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track configuration usage'
    }, { status: 500 })
  }
}

// GET /api/config/usage - Get usage statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const configId = searchParams.get('configId')
    const configType = searchParams.get('configType')
    
    if (!configId || !configType) {
      return NextResponse.json({
        success: false,
        error: 'Both configId and configType parameters are required'
      }, { status: 400 })
    }

    const stats = await configService.getConfigStats(parseInt(configId), configType)
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('❌ Error fetching config stats:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch configuration statistics'
    }, { status: 500 })
  }
}
