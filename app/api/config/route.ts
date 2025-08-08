import { NextRequest, NextResponse } from 'next/server'
import configLoader from '@/lib/config-loader'

export async function GET(request: NextRequest) {
  try {
    const config = await configLoader.loadConfig()
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error loading config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load configuration'
    }, { status: 500 })
  }
}
