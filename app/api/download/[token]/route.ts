import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import configLoader from '@/lib/config-loader'

/**
 * @swagger
 * /api/download/{token}:
 *   get:
 *     summary: Download ebook with token
 *     description: Download an ebook file using a valid download token
 *     tags: [Email]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Download token received via email
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, epub]
 *         description: Preferred ebook format (optional)
 *     responses:
 *       302:
 *         description: Redirect to ebook file
 *         headers:
 *           Location:
 *             description: URL to the ebook file
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ebook file not found
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Validate token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired download link' },
        { status: 400 }
      )
    }

    // Load book configuration
    const config = await configLoader.loadConfig()
    const ebookConfig = config.book.ebook

    if (!ebookConfig) {
      return NextResponse.json(
        { error: 'No ebook files configured' },
        { status: 500 }
      )
    }

    // Get the requested format from query params, or use default
    const url = new URL(request.url)
    const requestedFormat = url.searchParams.get('format') as 'pdf' | 'epub' | null
    const format = requestedFormat && ebookConfig[requestedFormat] ? requestedFormat : ebookConfig.defaultFormat

    const ebookFile = ebookConfig[format]
    if (!ebookFile) {
      return NextResponse.json(
        { error: `No ${format.toUpperCase()} file available` },
        { status: 404 }
      )
    }

    // Mark token as used
    await supabaseAdmin
      .from('download_tokens')
      .update({ used: true })
      .eq('token', token)

    // Track download in analytics
    await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email: tokenData.email,
          action: 'download_completed',
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          created_at: new Date().toISOString(),
        }
      ])

    // Redirect to the actual file URL
    return NextResponse.redirect(ebookFile.url)

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
} 