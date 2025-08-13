import { NextRequest, NextResponse } from 'next/server'

// Mock Supabase client for development/testing
const createMockSupabaseClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 1 }, error: null })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  })
})

const supabase = process.env.NODE_ENV === 'test' || !process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? createMockSupabaseClient() 
  : (() => {
      const { createClient } = require('@supabase/supabase-js')
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    })()

// GET - Ottieni l'assegnazione di un visitatore per un test
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')
    const testId = searchParams.get('testId')
    
    if (!visitorId || !testId) {
      return NextResponse.json(
        { error: 'Visitor ID and Test ID are required' },
        { status: 400 }
      )
    }

    const { data: assignment, error } = await supabase
      .from('ab_visitor_assignments')
      .select('variant_id')
      .eq('visitor_id', visitorId)
      .eq('test_id', testId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching assignment:', error)
      return NextResponse.json(
        { error: 'Failed to fetch assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      variantId: assignment?.variant_id || null 
    })
  } catch (error) {
    console.error('Error in GET /api/ab-testing/assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Assegna una variante a un visitatore
export async function POST(request: NextRequest) {
  try {
    const { visitorId, testId, variantId } = await request.json()
    
    if (!visitorId || !testId || !variantId) {
      return NextResponse.json(
        { error: 'Visitor ID, Test ID, and Variant ID are required' },
        { status: 400 }
      )
    }

    // Inserisci o aggiorna l'assegnazione
    const { data: assignment, error } = await supabase
      .from('ab_visitor_assignments')
      .upsert({
        visitor_id: visitorId,
        test_id: testId,
        variant_id: variantId,
        assigned_at: new Date().toISOString()
      }, {
        onConflict: 'visitor_id,test_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating assignment:', error)
      return NextResponse.json(
        { error: 'Failed to create assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error in POST /api/ab-testing/assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Rimuovi un'assegnazione
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')
    const testId = searchParams.get('testId')
    
    if (!visitorId || !testId) {
      return NextResponse.json(
        { error: 'Visitor ID and Test ID are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('ab_visitor_assignments')
      .delete()
      .eq('visitor_id', visitorId)
      .eq('test_id', testId)

    if (error) {
      console.error('Error deleting assignment:', error)
      return NextResponse.json(
        { error: 'Failed to delete assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/ab-testing/assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
