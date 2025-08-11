import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'
import { AnalyticsEvent, AnalyticsResponse } from '@/types/analytics'

/**
 * @swagger
 * /api/analytics:
 *   post:
 *     summary: Track analytics event
 *     description: Track a detailed analytics event with user data
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyticsEvent'
 *     responses:
 *       200:
 *         description: Event tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
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
export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEvent = await request.json()
    const { 
      email, 
      action, 
      timestamp, 
      userAgent, 
      referrer, 
      scrollDepth, 
      timeOnPage 
    } = body

    // Validate required fields
    if (!action || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adapter = getDatabaseAdapter()

    // Insert analytics data
    const data = await adapter.trackVisit({
      id: `analytics-${Date.now()}`,
      visitor_id: `visitor-${Date.now()}`,
      page_url: request.url,
      user_agent: userAgent,
      ip_address: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      referrer,
      email: email || null,
      action,
      timestamp,
      scroll_depth: scrollDepth || null,
      time_on_page: timeOnPage || null,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 