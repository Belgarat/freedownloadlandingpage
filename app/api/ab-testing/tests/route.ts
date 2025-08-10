import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ABTest, ABVariant } from '@/types/ab-testing'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    // Fetch all tests with their variants and calculated stats
    const { data: tests, error: testsError } = await supabaseAdmin
      .from('ab_tests')
      .select(`
        *,
        ab_variants (
          id,
          name,
          description,
          value,
          css_class,
          css_style,
          visitors,
          conversions,
          conversion_rate,
          is_control,
          is_winner,
          confidence_level,
          improvement
        )
      `)
      .order('created_at', { ascending: false })

    if (testsError) {
      console.error('Error fetching tests:', testsError)
      return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedTests = tests?.map(test => ({
      ...test,
      variants: test.ab_variants || []
    })) || []

    return NextResponse.json(transformedTests)
  } catch (error) {
    console.error('Error in GET /api/ab-testing/tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      type,
      traffic_split,
      target_element,
      target_selector,
      conversion_goal,
      variants
    } = body

    // Validate required fields
    if (!name || !description || !type || !target_selector || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, type, target_selector, variants' },
        { status: 400 }
      )
    }

    // Create the test
    const { data: test, error: testError } = await supabaseAdmin
      .from('ab_tests')
      .insert({
        name,
        description,
        type,
        status: 'draft',
        traffic_split: traffic_split || 50,
        target_element: target_element || target_selector,
        target_selector,
        conversion_goal,
        statistical_significance: 95,
        total_visitors: 0,
        conversions: 0,
        conversion_rate: 0
      })
      .select()
      .single()

    if (testError) {
      console.error('Error creating test:', testError)
      return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
    }

    // Create variants for the test
    const variantsWithTestId = variants.map((variant: any, index: number) => ({
      test_id: test.id,
      name: variant.name,
      description: variant.description,
      value: variant.value,
      css_class: variant.css_class,
      css_style: variant.css_style,
      visitors: 0,
      conversions: 0,
      conversion_rate: 0,
      is_control: variant.is_control || index === 0,
      is_winner: false,
      confidence_level: null,
      improvement: null
    }))

    const { error: variantsError } = await supabaseAdmin
      .from('ab_variants')
      .insert(variantsWithTestId)

    if (variantsError) {
      console.error('Error creating variants:', variantsError)
      // Clean up the test if variants creation fails
      await supabaseAdmin.from('ab_tests').delete().eq('id', test.id)
      return NextResponse.json({ error: 'Failed to create variants' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      test: { ...test, variants: variantsWithTestId }
    })
  } catch (error) {
    console.error('Error in POST /api/ab-testing/tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Aggiorna un test
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('id')
    
    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 })
    }

    const testData: Partial<ABTest> = await request.json()
    
    // Aggiorna il test
    const { data: test, error: testError } = await supabaseAdmin
      .from('ab_tests')
      .update({
        name: testData.name,
        description: testData.description,
        status: testData.status,
        traffic_split: testData.traffic_split,
        start_date: testData.start_date,
        end_date: testData.end_date,
        target_element: testData.target_element,
        target_selector: testData.target_selector,
        conversion_goal: testData.conversion_goal,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)
      .select()
      .single()

    if (testError) {
      console.error('Error updating test:', testError)
      return NextResponse.json({ error: 'Failed to update test' }, { status: 500 })
    }

    // Se ci sono varianti da aggiornare
    if (testData.variants) {
      // Elimina le varianti esistenti
      await supabaseAdmin
        .from('ab_variants')
        .delete()
        .eq('test_id', testId)

      // Inserisci le nuove varianti
      const variantsToInsert = testData.variants.map(variant => ({
        test_id: testId,
        name: variant.name,
        description: variant.description,
        value: variant.value,
        css_class: variant.css_class,
        css_style: variant.css_style,
        is_control: variant.is_control,
        visitors: 0,
        conversions: 0,
        conversion_rate: 0,
        is_winner: false,
        confidence_level: null,
        improvement: null
      }))

      const { data: variants, error: variantsError } = await supabaseAdmin
        .from('ab_variants')
        .insert(variantsToInsert)
        .select()

      if (variantsError) {
        console.error('Error updating variants:', variantsError)
        return NextResponse.json({ error: 'Failed to update variants' }, { status: 500 })
      }

      return NextResponse.json({ ...test, variants })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error in PUT /api/ab-testing/tests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina un test
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('id')
    
    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('ab_tests')
      .delete()
      .eq('id', testId)

    if (error) {
      console.error('Error deleting test:', error)
      return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/ab-testing/tests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
