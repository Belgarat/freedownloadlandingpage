import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/analytics - Get configuration analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'marketing', 'theme', 'content'
    const timeRange = searchParams.get('timeRange') || '7d'
    
    if (!type) {
      return NextResponse.json({
        success: false,
        error: 'Type parameter is required (marketing, theme, content)'
      }, { status: 400 })
    }

    const analytics = await configService.getConfigAnalytics(type, timeRange)
    
    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('❌ Error fetching config analytics:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch configuration analytics'
    }, { status: 500 })
  }
}
