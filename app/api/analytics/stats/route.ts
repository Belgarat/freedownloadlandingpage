import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AnonymousCounterService } from '@/lib/anonymous-counters'
import { AdminStats } from '@/types/admin'

export async function GET() {
  try {
    // Get page views (kept for potential future metrics, but not used directly)
    await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'page_view')

    // Get email submissions
    const { count: emailSubmissions } = await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'email_submitted')

    // Get download requests
    const { count: downloadRequests } = await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'download_requested')

    // Get completed downloads
    const { count: completedDownloads } = await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'download_completed')

    // (Removed unused average time on page and conversion rate calculations)

    const downloadCompletionRate = downloadRequests && downloadRequests > 0
      ? ((completedDownloads || 0) / downloadRequests) * 100
      : 0

    // Get anonymous counters
    const anonymousCounters = await AnonymousCounterService.getCounters()

    const stats: AdminStats = {
      totalDownloads: completedDownloads || 0,
      downloadRequests: downloadRequests || 0,
      downloadCompletionRate: Math.round(downloadCompletionRate * 100) / 100,
      totalEmails: emailSubmissions || 0,
      recentDownloads: completedDownloads || 0,
      recentEmails: emailSubmissions || 0,
      // Anonymous counters (always available)
      anonymousVisits: anonymousCounters.totalVisits,
      anonymousDownloads: anonymousCounters.totalDownloads,
      anonymousEmails: anonymousCounters.totalEmailSubmissions,
      anonymousGoodreadsClicks: anonymousCounters.totalGoodreadsClicks,
      anonymousSubstackClicks: anonymousCounters.totalSubstackClicks,
      anonymousPublisherClicks: anonymousCounters.totalPublisherClicks,
      analytics: [],
      tokens: []
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
} 