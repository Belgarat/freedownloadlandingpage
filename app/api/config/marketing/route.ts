import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/marketing - Get all marketing configs
export async function GET() {
  try {
    const configs = await configService.getMarketingConfigs()
    
    return NextResponse.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('❌ Error fetching marketing configs:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch marketing configurations'
    }, { status: 500 })
  }
}

// POST /api/config/marketing - Create new marketing config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.cta_config || !body.modal_config || !body.offer_config || !body.social_proof_config) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, cta_config, modal_config, offer_config, social_proof_config'
      }, { status: 400 })
    }

    const config = await configService.createMarketingConfig({
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
      message: 'Marketing configuration created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating marketing config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create marketing configuration'
    }, { status: 500 })
  }
}
