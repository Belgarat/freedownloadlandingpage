import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

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

    const configService = new ConfigService()
    const config = await configService.getEmailConfig(configId)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error loading email config:', error)
    
    // Check if it's a "not found" error
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load email configuration'
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
    
    const config = await configService.updateEmailConfig(parseInt(id), body)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error updating email config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update email configuration'
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
    await configService.deleteEmailConfig(parseInt(id))
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting email config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete email configuration'
    }, { status: 500 })
  }
}
