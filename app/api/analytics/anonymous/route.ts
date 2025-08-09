import { NextRequest, NextResponse } from 'next/server'
import { AnonymousCounterService } from '@/lib/anonymous-counters'
import { AnonymousAnalyticsEvent } from '@/types/analytics'

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