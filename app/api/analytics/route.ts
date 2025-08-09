import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { AnalyticsEvent } from '@/types/analytics'

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

    // Insert analytics data into Supabase
    const { data, error } = await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email: email || null,
          action,
          timestamp,
          user_agent: userAgent,
          referrer,
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          scroll_depth: scrollDepth || null,
          time_on_page: timeOnPage || null,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save analytics data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 