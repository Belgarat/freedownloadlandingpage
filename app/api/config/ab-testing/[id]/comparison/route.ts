import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/ab-testing/[id]/comparison - Get A/B test comparison
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid test ID'
      }, { status: 400 })
    }

    const comparison = await configService.getConfigComparison(id)
    
    return NextResponse.json({
      success: true,
      data: comparison
    })
  } catch (error) {
    console.error('❌ Error fetching A/B test comparison:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch A/B test comparison'
    }, { status: 500 })
  }
}
