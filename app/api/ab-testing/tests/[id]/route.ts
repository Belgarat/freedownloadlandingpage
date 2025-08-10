import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['draft', 'running', 'paused', 'completed', 'stopped']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: draft, running, paused, completed, stopped' },
        { status: 400 }
      )
    }

    // Update the test status
    const { data: test, error: updateError } = await supabaseAdmin
      .from('ab_tests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating test status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update test status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      test 
    })
  } catch (error) {
    console.error('Error in PATCH /api/ab-testing/tests/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete associated variants first
    const { error: variantsError } = await supabaseAdmin
      .from('ab_variants')
      .delete()
      .eq('test_id', id)

    if (variantsError) {
      console.error('Error deleting variants:', variantsError)
      return NextResponse.json(
        { error: 'Failed to delete test variants' },
        { status: 500 }
      )
    }

    // Delete associated results
    const { error: resultsError } = await supabaseAdmin
      .from('ab_test_results')
      .delete()
      .eq('test_id', id)

    if (resultsError) {
      console.error('Error deleting test results:', resultsError)
      // Continue anyway, results might not exist
    }

    // Delete associated assignments
    const { error: assignmentsError } = await supabaseAdmin
      .from('ab_visitor_assignments')
      .delete()
      .eq('test_id', id)

    if (assignmentsError) {
      console.error('Error deleting visitor assignments:', assignmentsError)
      // Continue anyway, assignments might not exist
    }

    // Delete the test
    const { error: testError } = await supabaseAdmin
      .from('ab_tests')
      .delete()
      .eq('id', id)

    if (testError) {
      console.error('Error deleting test:', testError)
      return NextResponse.json(
        { error: 'Failed to delete test' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/ab-testing/tests/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
