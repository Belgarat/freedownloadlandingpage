import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Get average time on page
    const { data: timeData } = await supabaseAdmin
      .from('analytics')
      .select('time_on_page')
      .not('time_on_page', 'is', null)

    const avgTimeOnPage = timeData && timeData.length > 0
      ? timeData.reduce((sum, item) => sum + (item.time_on_page || 0), 0) / timeData.length
      : 0

    // Calculate conversion rate
    const conversionRate = pageViews && pageViews > 0
      ? ((emailSubmissions || 0) / pageViews) * 100
      : 0

    return NextResponse.json({
      pageViews: pageViews || 0,
      scrollToBottom: scrollToBottom || 0,
      emailSubmissions: emailSubmissions || 0,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      conversionRate,
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
} 