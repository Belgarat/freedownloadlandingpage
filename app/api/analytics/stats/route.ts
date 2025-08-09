import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AnonymousCounterService } from '@/lib/anonymous-counters'
import { AdminStats } from '@/types/admin'

export async function GET() {
  try {
    // Get page views
    const { count: pageViews } = await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'page_view')

    // Get scroll to bottom events
    const { count: scrollToBottom } = await supabaseAdmin
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'scroll_to_bottom')

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

    // Get average time on page
    // Get average time on page (use SQL AVG for efficiency)
    const { data: avgRows } = await supabaseAdmin
      .from('analytics')
      .select('time_on_page')
      .not('time_on_page', 'is', null)

    const avgTimeOnPage = avgRows && avgRows.length > 0
      ? avgRows.reduce((sum, r: any) => sum + (r.time_on_page || 0), 0) / avgRows.length
      : 0

    // Calculate conversion rates
    const emailConversionRate = pageViews && pageViews > 0
      ? ((emailSubmissions || 0) / pageViews) * 100
      : 0

    const downloadCompletionRate = downloadRequests && downloadRequests > 0
      ? ((completedDownloads || 0) / downloadRequests) * 100
      : 0

    // Get anonymous counters
    const anonymousCounters = await AnonymousCounterService.getCounters()

    const stats: AdminStats & {
      // Lightweight keys expected by AnalyticsDashboard
      pageViews: number
      scrollToBottom: number
      emailSubmissions: number
      avgTimeOnPage: number
      conversionRate: number
      partial?: boolean
    } = {
      // Lightweight keys for the simple dashboard
      pageViews: pageViews || 0,
      scrollToBottom: scrollToBottom || 0,
      emailSubmissions: emailSubmissions || 0,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      conversionRate: Math.round((emailConversionRate + Number.EPSILON) * 10) / 10,
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
    // In development, don't fail; return zeros to allow read-only dashboards
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        pageViews: 0,
        scrollToBottom: 0,
        emailSubmissions: 0,
        avgTimeOnPage: 0,
        conversionRate: 0,
        totalDownloads: 0,
        downloadRequests: 0,
        downloadCompletionRate: 0,
        totalEmails: 0,
        recentDownloads: 0,
        recentEmails: 0,
        anonymousVisits: 0,
        anonymousDownloads: 0,
        anonymousEmails: 0,
        anonymousGoodreadsClicks: 0,
        anonymousSubstackClicks: 0,
        anonymousPublisherClicks: 0,
        analytics: [],
        tokens: [],
        partial: true,
      })
    }
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 })
  }
} 