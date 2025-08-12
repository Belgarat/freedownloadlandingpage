import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    const configs = await configService.getSEOConfigs()
    
    return NextResponse.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('❌ Error loading SEO configs:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load SEO configurations'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const configService = new ConfigService()
    
    const config = await configService.createSEOConfig(body)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error creating SEO config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create SEO configuration'
    }, { status: 500 })
  }
}
