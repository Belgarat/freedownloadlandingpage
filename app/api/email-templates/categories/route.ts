import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

/**
 * @swagger
 * /api/email-templates/categories:
 *   get:
 *     summary: Get all template categories
 *     description: Retrieve all available template categories
 *     tags: [Email Templates]
 *     responses:
 *       200:
 *         description: List of template categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TemplateCategory'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new template category
 *     description: Create a new template category
 *     tags: [Email Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemplateCategory'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    const categories = await adapter.getTemplateCategories()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching template categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const adapter = getDatabaseAdapter()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    // Create category
    const category = await adapter.createTemplateCategory({
      name: body.name,
      description: body.description
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating template category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
