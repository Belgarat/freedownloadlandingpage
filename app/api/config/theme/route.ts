import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/theme - Get all theme configs
export async function GET() {
  try {
    const configs = await configService.getThemeConfigs()
    
    return NextResponse.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('❌ Error fetching theme configs:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch theme configurations'
    }, { status: 500 })
  }
}

// POST /api/config/theme - Create new theme config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.colors || !body.fonts || !body.layout || !body.spacing || !body.animations || !body.development || !body.surface) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, colors, fonts, layout, spacing, animations, development, surface'
      }, { status: 400 })
    }

    const config = await configService.createThemeConfig({
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
      message: 'Theme configuration created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating theme config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create theme configuration'
    }, { status: 500 })
  }
}
