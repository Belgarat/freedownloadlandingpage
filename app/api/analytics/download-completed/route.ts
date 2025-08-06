import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { token, downloadSize, downloadTime } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      )
    }

    // Validate token in database
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 404 }
      )
    }

    // Track completed download in analytics
    await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email: tokenData.email,
          action: 'download_completed',
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          created_at: new Date().toISOString(),
          metadata: JSON.stringify({
            token_id: tokenData.id,
            download_size: downloadSize,
            download_time_ms: downloadTime,
            completion_rate: '100%'
          })
        }
      ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Download completion tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track download completion' },
      { status: 500 }
    )
  }
} 