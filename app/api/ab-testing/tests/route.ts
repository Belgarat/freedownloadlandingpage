import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'
import { ABTest, ABVariant } from '@/types/ab-testing'

/**
 * @swagger
 * /api/ab-testing/tests:
 *   get:
 *     summary: Get all A/B tests
 *     description: Retrieve all A/B tests with their variants and statistics
 *     tags: [A/B Testing]
 *     responses:
 *       200:
 *         description: A/B tests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ABTest'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new A/B test
 *     description: Create a new A/B test with variants
 *     tags: [A/B Testing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, type, target_selector, variants]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "CTA Button Test"
 *               description:
 *                 type: string
 *                 example: "Testing different button colors"
 *               type:
 *                 type: string
 *                 enum: [headline, cta_button, layout]
 *                 example: "cta_button"
 *               traffic_split:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 50
 *               target_element:
 *                 type: string
 *                 example: "cta-button"
 *               target_selector:
 *                 type: string
 *                 example: ".cta-button"
 *               conversion_goal:
 *                 type: string
 *                 example: "email_submit"
 *               variants:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ABVariant'
 *     responses:
 *       200:
 *         description: A/B test created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 test:
 *                   $ref: '#/components/schemas/ABTest'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update an A/B test
 *     description: Update an existing A/B test
 *     tags: [A/B Testing]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: A/B test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ABTest'
 *     responses:
 *       200:
 *         description: A/B test updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ABTest'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete an A/B test
 *     description: Delete an A/B test and all its variants
 *     tags: [A/B Testing]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: A/B test ID
 *     responses:
 *       200:
 *         description: A/B test deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

    // PUT - Update a test
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('id')
    
    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 })
    }

    const testData: Partial<ABTest> = await request.json()
    const adapter = getDatabaseAdapter()
    
    // Update the test
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

    // If there are variants to update
    if (testData.variants) {
              // Delete existing variants (not implemented in adapter yet)
        // await adapter.deleteABVariants(testId)
        
        // Insert new variants
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

    // DELETE - Delete a test
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
