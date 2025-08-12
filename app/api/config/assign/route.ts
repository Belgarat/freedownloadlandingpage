import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// POST /api/config/assign - Assign configuration to visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.visitor_id || !body.config_type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: visitor_id, config_type'
      }, { status: 400 })
    }

    const configId = await configService.assignConfigToVisitor(body.visitor_id, body.config_type)
    
    return NextResponse.json({
      success: true,
      data: { config_id: configId },
      message: 'Configuration assigned successfully'
    })
  } catch (error) {
    console.error('❌ Error assigning config to visitor:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign configuration to visitor'
    }, { status: 500 })
  }
}
