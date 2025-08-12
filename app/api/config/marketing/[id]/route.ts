import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/marketing/[id] - Get specific marketing config
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const config = await configService.getMarketingConfig(id)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch marketing configuration'
    }, { status: 500 })
  }
}

// PUT /api/config/marketing/[id] - Update marketing config
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const body = await request.json()
    
    const config = await configService.updateMarketingConfig(id, {
      name: body.name,
      description: body.description,
      cta_config: body.cta_config,
      modal_config: body.modal_config,
      offer_config: body.offer_config,
      social_proof_config: body.social_proof_config
    })
    
    return NextResponse.json({
      success: true,
      data: config,
      message: 'Marketing configuration updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update marketing configuration'
    }, { status: 500 })
  }
}

// DELETE /api/config/marketing/[id] - Delete marketing config
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    await configService.deleteMarketingConfig(id)
    
    return NextResponse.json({
      success: true,
      message: 'Marketing configuration deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete marketing configuration'
    }, { status: 500 })
  }
}
