import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
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
        { error: 'Invalid or expired download link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      )
    }

    // Check if token has already been used (only after 24 hours)
    const tokenCreatedAt = new Date(tokenData.created_at)
    const hoursSinceCreation = (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceCreation > 24) {
      return NextResponse.json(
        { error: 'Download link has expired (24 hours)' },
        { status: 410 }
      )
    }

    // Track validation in analytics
    await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email: tokenData.email,
          action: 'download_page_visited',
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          created_at: new Date().toISOString(),
        }
      ])

    return NextResponse.json({
      success: true,
      valid: true,
      email: tokenData.email,
      expiresAt: tokenData.expires_at
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    )
  }
} 