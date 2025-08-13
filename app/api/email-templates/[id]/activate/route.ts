import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

/**
 * @swagger
 * /api/email-templates/{id}/activate:
 *   post:
 *     summary: Activate email template for specific type
 *     description: Activate an email template for download or followup emails
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
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [download, followup]
 *                 description: Type of email template to activate
 *     responses:
 *       200:
 *         description: Template activated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { type } = body

    if (!type || !['download', 'followup'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "download" or "followup"' },
        { status: 400 }
      )
    }

    const adapter = getDatabaseAdapter()
    
    // Check if template exists
    const template = await adapter.getEmailTemplate(id)
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update email config to use this template
    const emailConfigs = await adapter.getEmailConfigs()
    const activeConfig = emailConfigs.find(config => config.is_active)
    
    if (activeConfig) {
      // Update the active config to use this template
      // templates is already an object from the database adapter
      const templates = activeConfig.templates || {}
      templates[type] = {
        templateId: id,
        templateName: template.name
      }
      
      await adapter.updateEmailConfig(activeConfig.id, {
        ...activeConfig,
        templates: templates
      })
    } else {
      // Create a new active config if none exists
      const templates = {
        [type]: {
          templateId: id,
          templateName: template.name
        }
      }
      
      await adapter.createEmailConfig({
        name: 'Default Email Config',
        description: 'Default email configuration',
        sender: {
          name: 'Author',
          email: 'noreply@example.com',
          replyTo: 'author@example.com'
        },
        templates: templates,
        settings: {
          templateExpiryHours: 24,
          maxRetries: 3,
          tracking: true
        },
        is_active: true,
        is_default: true
      })
    }

    return NextResponse.json({
      message: `Template "${template.name}" activated for ${type} emails`,
      templateId: id,
      type
    })
  } catch (error) {
    console.error('Error activating email template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
