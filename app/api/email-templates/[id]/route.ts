import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

/**
 * @swagger
 * /api/email-templates/{id}:
 *   get:
 *     summary: Get email template by ID
 *     description: Retrieve a specific email template with its placeholders and categories
 *     tags: [Email Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Email template ID
 *     responses:
 *       200:
 *         description: Email template details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update email template
 *     description: Update an existing email template
 *     tags: [Email Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Email template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplateFormData'
 *     responses:
 *       200:
 *         description: Email template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete email template
 *     description: Delete an email template and its associated placeholders
 *     tags: [Email Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Email template ID
 *     responses:
 *       204:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }
    
    const adapter = getDatabaseAdapter()
    const template = await adapter.getEmailTemplate(id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error fetching email template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const adapter = getDatabaseAdapter()
    
    // Validate required fields
    if (!body.name || !body.subject || !body.html_content) {
      return NextResponse.json(
        { error: 'Name, subject, and HTML content are required' },
        { status: 400 }
      )
    }
    
    // Check if template exists
    const existingTemplate = await adapter.getEmailTemplate(id)
    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    // Update template
    const updatedTemplate = await adapter.updateEmailTemplate(id, {
      name: body.name,
      subject: body.subject,
      html_content: body.html_content,
      text_content: body.text_content,
      description: body.description,
      is_default: body.is_default || false
    })
    
    // Update placeholders if provided
    if (body.placeholders && Array.isArray(body.placeholders)) {
      // Delete existing placeholders
      const existingPlaceholders = await adapter.getTemplatePlaceholders(id)
      for (const placeholder of existingPlaceholders) {
        await adapter.deleteTemplatePlaceholder(placeholder.id)
      }
      
      // Create new placeholders
      for (const placeholder of body.placeholders) {
        await adapter.createTemplatePlaceholder({
          template_id: id,
          placeholder_key: placeholder.placeholder_key,
          placeholder_name: placeholder.placeholder_name,
          description: placeholder.description,
          default_value: placeholder.default_value,
          is_required: placeholder.is_required || false
        })
      }
    }
    
    // Get the complete updated template
    const completeTemplate = await adapter.getEmailTemplate(id)
    
    return NextResponse.json(completeTemplate)
  } catch (error) {
    console.error('Error updating email template:', error)
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
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }
    
    const adapter = getDatabaseAdapter()
    
    // Check if template exists
    const existingTemplate = await adapter.getEmailTemplate(id)
    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    // Delete template (placeholders will be deleted automatically due to CASCADE)
    await adapter.deleteEmailTemplate(id)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
