import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/theme/[id] - Get specific theme config
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const configId = parseInt(id)
    
    if (isNaN(configId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const config = await configService.getThemeConfig(configId)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch theme configuration'
    }, { status: 500 })
  }
}

// PUT /api/config/theme/[id] - Update theme config
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const configId = parseInt(id)
    
    if (isNaN(configId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const body = await request.json()
    
    const config = await configService.updateThemeConfig(configId, {
      name: body.name,
      description: body.description,
      colors: body.colors,
      fonts: body.fonts,
      layout: body.layout,
      spacing: body.spacing,
      animations: body.animations,
      development: body.development,
      surface: body.surface
    })
    
    return NextResponse.json({
      success: true,
      data: config,
      message: 'Theme configuration updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update theme configuration'
    }, { status: 500 })
  }
}

// DELETE /api/config/theme/[id] - Delete theme config
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const configId = parseInt(id)
    
    if (isNaN(configId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    await configService.deleteThemeConfig(configId)
    
    return NextResponse.json({
      success: true,
      message: 'Theme configuration deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete theme configuration'
    }, { status: 500 })
  }
}
