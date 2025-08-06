import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get analytics data from Supabase
    const { data: analytics, error: analyticsError } = await supabaseAdmin
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false })

    if (analyticsError) {
      console.error('Analytics fetch error:', analyticsError)
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      )
    }

    // Get download tokens data
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('download_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    if (tokensError) {
      console.error('Tokens fetch error:', tokensError)
      return NextResponse.json(
        { error: 'Failed to fetch tokens' },
        { status: 500 }
      )
    }

    // Get anonymous counters (always available)
    const { AnonymousCounterService } = await import('@/lib/anonymous-counters')
    const anonymousCounters = await AnonymousCounterService.getCounters()

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

    return NextResponse.json({
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
      analytics: analytics || [],
      tokens: tokens || []
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 