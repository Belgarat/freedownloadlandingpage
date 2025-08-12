import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const configService = new ConfigService()
    const config = await configService.getSEOConfig(parseInt(id))
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error loading SEO config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load SEO configuration'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const configService = new ConfigService()
    
    const config = await configService.updateSEOConfig(parseInt(id), body)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error updating SEO config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update SEO configuration'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const configService = new ConfigService()
    await configService.deleteSEOConfig(parseInt(id))
    
    return NextResponse.json({
      success: true,
      message: 'SEO configuration deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting SEO config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete SEO configuration'
    }, { status: 500 })
  }
}
