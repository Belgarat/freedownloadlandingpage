import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'
import { AdminStats } from '@/types/admin'

export async function GET(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()

    // Get analytics data
    const analytics = await adapter.getAnalytics()

    // Get download tokens data
    const tokens = await adapter.getDownloadTokens()

    // Get anonymous counters (always available)
    const { AnonymousCounterService } = await import('@/lib/anonymous-counters')
    const anonymousCounters = await AnonymousCounterService.getCounters()

    // Get A/B testing data
    const abTests = await adapter.getABTests()

    // Calculate statistics
    const totalDownloads = analytics?.filter(item => item.action === 'download_completed').length || 0
    const downloadRequests = analytics?.filter(item => item.action === 'download_requested').length || 0
    const totalEmails = tokens?.length || 0
    
    // Recent stats (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentDownloads = analytics?.filter(item => 
      item.action === 'download_completed' && 
      new Date(item.created_at) > sevenDaysAgo
    ).length || 0
    
    const recentEmails = tokens?.filter(token => 
      new Date(token.created_at) > sevenDaysAgo
    ).length || 0

    // Calculate completion rate
    const downloadCompletionRate = downloadRequests > 0 
      ? Math.round((totalDownloads / downloadRequests) * 100) 
      : 0

    const stats: AdminStats = {
      totalDownloads,
      downloadRequests,
      downloadCompletionRate,
      totalEmails,
      recentDownloads,
      recentEmails,
      // Anonymous counters (always available)
      anonymousVisits: anonymousCounters.totalVisits,
      anonymousDownloads: anonymousCounters.totalDownloads,
      anonymousEmails: anonymousCounters.totalEmailSubmissions,
      anonymousGoodreadsClicks: anonymousCounters.totalGoodreadsClicks,
      anonymousSubstackClicks: anonymousCounters.totalSubstackClicks,
      anonymousPublisherClicks: anonymousCounters.totalPublisherClicks,
      // A/B testing data
      abTesting: abTests || [],
      analytics: analytics || [],
      tokens: tokens || []
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 