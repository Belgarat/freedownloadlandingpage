import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    const configs = await configService.getEmailConfigs()
    
    return NextResponse.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('❌ Error loading email configs:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load email configurations'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const configService = new ConfigService()
    
    const config = await configService.createEmailConfig(body)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error creating email config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create email configuration'
    }, { status: 500 })
  }
}
