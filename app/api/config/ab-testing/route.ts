import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/ab-testing - Get all A/B tests
export async function GET() {
  try {
    const tests = await configService.getConfigABTests()
    
    return NextResponse.json({
      success: true,
      data: tests
    })
  } catch (error) {
    console.error('❌ Error fetching A/B tests:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch A/B tests'
    }, { status: 500 })
  }
}

// POST /api/config/ab-testing - Create new A/B test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.test_name || !body.config_type || !body.config_a_id || !body.config_b_id || !body.start_date) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: test_name, config_type, config_a_id, config_b_id, start_date'
      }, { status: 400 })
    }

    const test = await configService.createConfigABTest({
      test_name: body.test_name,
      config_type: body.config_type,
      config_a_id: body.config_a_id,
      config_b_id: body.config_b_id,
      start_date: body.start_date,
      end_date: body.end_date,
      status: body.status || 'active',
      winner_config_id: body.winner_config_id,
      confidence_level: body.confidence_level,
      total_participants: body.total_participants || 0
    })
    
    return NextResponse.json({
      success: true,
      data: test,
      message: 'A/B test created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating A/B test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create A/B test'
    }, { status: 500 })
  }
}
