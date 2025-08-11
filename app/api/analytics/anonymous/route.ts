import { NextRequest, NextResponse } from 'next/server'
import { AnonymousCounterService } from '@/lib/anonymous-counters'
import { AnonymousAnalyticsEvent, AnonymousAnalyticsResponse } from '@/types/analytics'

/**
 * @swagger
 * /api/analytics/anonymous:
 *   post:
 *     summary: Track anonymous analytics event
 *     description: Track GDPR-compliant anonymous analytics events without storing personal data
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnonymousEvent'
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
 *   get:
 *     summary: Get anonymous analytics counters
 *     description: Retrieve current anonymous analytics counters
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Anonymous counters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visits:
 *                   type: integer
 *                   example: 1234
 *                 downloads:
 *                   type: integer
 *                   example: 567
 *                 emailSubmissions:
 *                   type: integer
 *                   example: 89
 *                 goodreadsClicks:
 *                   type: integer
 *                   example: 12
 *                 substackClicks:
 *                   type: integer
 *                   example: 34
 *                 publisherClicks:
 *                   type: integer
 *                   example: 56
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const { action }: AnonymousAnalyticsEvent = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

                    // GDPR-compliant anonymous tracking (no personal data)
                switch (action) {
                  case 'page_view':
                    await AnonymousCounterService.incrementVisits()
                    break
                  case 'download_requested':
                    await AnonymousCounterService.incrementDownloads()
                    break
                  case 'email_submitted':
                    await AnonymousCounterService.incrementEmailSubmissions()
                    break
                  case 'goodreads_click':
                    await AnonymousCounterService.incrementGoodreadsClicks()
                    break
                  case 'substack_click':
                    await AnonymousCounterService.incrementSubstackClicks()
                    break
                  case 'publisher_click':
                    await AnonymousCounterService.incrementPublisherClicks()
                    break
                  default:
                    return NextResponse.json(
                      { error: 'Invalid action' },
                      { status: 400 }
                    )
                }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Anonymous analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to track anonymous event' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const counters = await AnonymousCounterService.getCounters()
    return NextResponse.json(counters)
  } catch (error) {
    console.error('Error getting anonymous counters:', error)
    return NextResponse.json(
      { error: 'Failed to get counters' },
      { status: 500 }
    )
  }
} 