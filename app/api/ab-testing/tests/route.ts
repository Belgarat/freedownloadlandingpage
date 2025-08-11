import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'
import { ABTest, ABVariant } from '@/types/ab-testing'

export async function GET() {
  try {
    const adapter = getDatabaseAdapter()
    const tests = await adapter.getABTests()
    
    return NextResponse.json(tests)
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

    const adapter = getDatabaseAdapter()

    // Create the test
    const test = await adapter.createABTest({
      id: `test-${Date.now()}`,
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

    // Create variants for the test
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      await adapter.createABVariant({
        id: `variant-${Date.now()}-${i}`,
        test_id: test.id,
        name: variant.name,
        content: variant.content || variant.value,
        css_class: variant.css_class,
        css_style: variant.css_style,
        is_control: variant.is_control || i === 0,
        is_winner: false,
        visitors: 0,
        conversions: 0,
        conversion_rate: 0
      })
    }

    // Get the complete test with variants
    const completeTest = await adapter.getABTests()
    const createdTest = completeTest.find(t => t.id === test.id)

    return NextResponse.json({
      success: true,
      test: createdTest
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
    const adapter = getDatabaseAdapter()
    
    // Aggiorna il test
    const updatedTest = await adapter.updateABTest(testId, {
      name: testData.name,
      description: testData.description,
      status: testData.status,
      traffic_split: testData.traffic_split,
      start_date: testData.start_date,
      end_date: testData.end_date,
      target_element: testData.target_element,
      target_selector: testData.target_selector,
      conversion_goal: testData.conversion_goal
    })

    // Se ci sono varianti da aggiornare
    if (testData.variants) {
      // Elimina le varianti esistenti (non implementato nell'adapter, per ora)
      // await adapter.deleteABVariants(testId)

      // Inserisci le nuove varianti
      for (let i = 0; i < testData.variants.length; i++) {
        const variant = testData.variants[i]
        await adapter.createABVariant({
          id: `variant-${Date.now()}-${i}`,
          test_id: testId,
          name: variant.name,
          content: variant.content || variant.value,
          css_class: variant.css_class,
          css_style: variant.css_style,
          is_control: variant.is_control || i === 0,
          is_winner: false,
          visitors: 0,
          conversions: 0,
          conversion_rate: 0
        })
      }

      // Get the complete test with variants
      const completeTest = await adapter.getABTests()
      const testWithVariants = completeTest.find(t => t.id === testId)
      return NextResponse.json(testWithVariants)
    }

    return NextResponse.json(updatedTest)
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

    const adapter = getDatabaseAdapter()
    await adapter.deleteABTest(testId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/ab-testing/tests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
