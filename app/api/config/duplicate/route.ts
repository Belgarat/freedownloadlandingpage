import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// POST /api/config/duplicate - Duplicate configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.id || !body.type || !body.newName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: id, type, newName'
      }, { status: 400 })
    }

    const id = parseInt(body.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const duplicatedConfig = await configService.duplicateConfig(id, body.type, body.newName)
    
    return NextResponse.json({
      success: true,
      data: duplicatedConfig,
      message: 'Configuration duplicated successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error duplicating config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to duplicate configuration'
    }, { status: 500 })
  }
}
