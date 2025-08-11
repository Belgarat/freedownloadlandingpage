import { NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'
import { AnonymousCounterService } from '@/lib/anonymous-counters'
import { AdminStats } from '@/types/admin'

export async function GET() {
  try {
    const adapter = getDatabaseAdapter()
    
    // Get all analytics data
    const analytics = await adapter.getAnalytics()
    
    // Calculate stats from analytics data
    const pageViews = analytics.filter(item => item.action === 'page_view').length
    const scrollToBottom = analytics.filter(item => item.action === 'scroll_to_bottom').length
    const emailSubmissions = analytics.filter(item => item.action === 'email_submitted').length
    const downloadRequests = analytics.filter(item => item.action === 'download_requested').length
    const completedDownloads = analytics.filter(item => item.action === 'download_completed').length

    // Calculate average time on page
    const timeOnPageData = analytics.filter(item => item.time_on_page && item.time_on_page > 0)
    const avgTimeOnPage = timeOnPageData.length > 0
      ? timeOnPageData.reduce((sum, item) => sum + (item.time_on_page || 0), 0) / timeOnPageData.length
      : 0

    // Calculate conversion rates
    const emailConversionRate = pageViews > 0
      ? (emailSubmissions / pageViews) * 100
      : 0

    const downloadCompletionRate = downloadRequests > 0
      ? (completedDownloads / downloadRequests) * 100
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
      pageViews,
      scrollToBottom,
      emailSubmissions,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      conversionRate: Math.round((emailConversionRate + Number.EPSILON) * 10) / 10,
      totalDownloads: completedDownloads,
      downloadRequests,
      downloadCompletionRate: Math.round(downloadCompletionRate * 100) / 100,
      totalEmails: emailSubmissions,
      recentDownloads: completedDownloads,
      recentEmails: emailSubmissions,
      // Anonymous counters (always available)
      anonymousVisits: anonymousCounters.totalVisits,
      anonymousDownloads: anonymousCounters.totalDownloads,
      anonymousEmails: anonymousCounters.totalEmailSubmissions,
      anonymousGoodreadsClicks: anonymousCounters.totalGoodreadsClicks,
      anonymousSubstackClicks: anonymousCounters.totalSubstackClicks,
      anonymousPublisherClicks: anonymousCounters.totalPublisherClicks,
      analytics,
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
        tokens: []
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
} 