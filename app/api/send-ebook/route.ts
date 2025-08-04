import { NextRequest, NextResponse } from 'next/server'
import { sendEbookEmail, verifyEmail } from '@/lib/resend'
import { generateDownloadToken, createDownloadUrl } from '@/lib/download-tokens'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Verify email format and check for disposable emails
    try {
      await verifyEmail(email)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid email' },
        { status: 400 }
      )
    }

    // Generate download token
    const downloadToken = generateDownloadToken(email)
    const downloadUrl = createDownloadUrl(downloadToken.token)

    // Store token in database
    const { error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .insert([
        {
          email: downloadToken.email,
          token: downloadToken.token,
          expires_at: downloadToken.expiresAt.toISOString(),
          used: false,
          created_at: downloadToken.createdAt.toISOString(),
        }
      ])

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    // Track the email submission in analytics
    await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email,
          action: 'email_verified_and_token_generated',
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          created_at: new Date().toISOString(),
        }
      ])

    // Send the ebook email via Resend with secure download link
    const result = await sendEbookEmail({
      email,
      name,
      downloadUrl
    })

    return NextResponse.json({
      success: true,
      message: 'Download link sent successfully',
      messageId: result.messageId
    })

  } catch (error) {
    console.error('Send ebook error:', error)
    return NextResponse.json(
      { error: 'Failed to send download link. Please try again.' },
      { status: 500 }
    )
  }
} 