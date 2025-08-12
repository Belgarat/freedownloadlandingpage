import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/ab-testing/[id] - Get specific A/B test
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

    const test = await configService.getConfigABTest(id)
    
    return NextResponse.json({
      success: true,
      data: test
    })
  } catch (error) {
    console.error('❌ Error fetching A/B test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch A/B test'
    }, { status: 500 })
  }
}

// PUT /api/config/ab-testing/[id] - Update A/B test
export async function PUT(
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

    const body = await request.json()
    
    const test = await configService.updateConfigABTest(id, {
      test_name: body.test_name,
      config_type: body.config_type,
      config_a_id: body.config_a_id,
      config_b_id: body.config_b_id,
      start_date: body.start_date,
      end_date: body.end_date,
      status: body.status,
      winner_config_id: body.winner_config_id,
      confidence_level: body.confidence_level,
      total_participants: body.total_participants
    })
    
    return NextResponse.json({
      success: true,
      data: test,
      message: 'A/B test updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating A/B test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update A/B test'
    }, { status: 500 })
  }
}

// DELETE /api/config/ab-testing/[id] - Delete A/B test
export async function DELETE(
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

    await configService.deleteConfigABTest(id)
    
    return NextResponse.json({
      success: true,
      message: 'A/B test deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting A/B test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete A/B test'
    }, { status: 500 })
  }
}
