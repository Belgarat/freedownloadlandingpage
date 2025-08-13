import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

/**
 * @swagger
 * /api/email-templates:
 *   get:
 *     summary: Get all email templates
 *     description: Retrieve all email templates with their placeholders and categories
 *     tags: [Email Templates]
 *     responses:
 *       200:
 *         description: List of email templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmailTemplate'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new email template
 *     description: Create a new email template with optional placeholders and categories
 *     tags: [Email Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplateFormData'
 *     responses:
 *       201:
 *         description: Email template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    const templates = await adapter.getEmailTemplates()
    
    // Get active email config to determine which templates are active
    const emailConfigs = await adapter.getEmailConfigs()
    const activeConfig = emailConfigs.find(config => config.is_active)
    
    let activeTemplates: Record<string, number> = {}
    if (activeConfig && activeConfig.templates) {
      // templates is already an object from the database adapter
      const templatesConfig = activeConfig.templates
      activeTemplates = {
        download: templatesConfig.download?.templateId,
        followup: templatesConfig.followup?.templateId
      }
    }
    
    // Add isActive flag to templates
    const templatesWithActiveFlag = templates.map(template => ({
      ...template,
      isActive: activeTemplates.download === template.id || activeTemplates.followup === template.id
    }))
    
    return NextResponse.json({
      templates: templatesWithActiveFlag,
      activeTemplates
    })
  } catch (error) {
    console.error('Error fetching email templates:', error)
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
    if (!body.name || !body.subject || !body.html_content) {
      return NextResponse.json(
        { error: 'Name, subject, and HTML content are required' },
        { status: 400 }
      )
    }
    
    // Create template
    const template = await adapter.createEmailTemplate({
      name: body.name,
      subject: body.subject,
      html_content: body.html_content,
      text_content: body.text_content,
      description: body.description,
      is_default: body.is_default || false
    })
    
    // Create placeholders if provided
    if (body.placeholders && Array.isArray(body.placeholders)) {
      for (const placeholder of body.placeholders) {
        await adapter.createTemplatePlaceholder({
          template_id: template.id,
          placeholder_key: placeholder.placeholder_key,
          placeholder_name: placeholder.placeholder_name,
          description: placeholder.description,
          default_value: placeholder.default_value,
          is_required: placeholder.is_required || false
        })
      }
    }
    
    // Get the complete template with placeholders
    const completeTemplate = await adapter.getEmailTemplate(template.id)
    
    return NextResponse.json(completeTemplate, { status: 201 })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
