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

    // Validate email format and check for disposable emails
    try {
      await verifyEmail(email)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email'
      
      // Return specific error messages for different validation failures
      if (errorMessage.includes('Invalid email format')) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }
      
      if (errorMessage.includes('Disposable email')) {
        return NextResponse.json(
          { error: 'Please use a valid email address (disposable emails are not allowed)' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: errorMessage },
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
        { error: 'Failed to generate download link. Please try again.' },
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
    try {
      const result = await sendEbookEmail({
        email,
        name,
        downloadUrl
      })

      // Track successful email send
      await supabaseAdmin
        .from('analytics')
        .insert([
          {
            email,
            action: 'email_sent_successfully',
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
        message: 'Download link sent successfully',
        messageId: result.messageId
      })

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      
      // Track failed email send
      await supabaseAdmin
        .from('analytics')
        .insert([
          {
            email,
            action: 'email_send_failed',
            timestamp: new Date().toISOString(),
            user_agent: request.headers.get('user-agent') || 'unknown',
            referrer: request.headers.get('referer') || 'unknown',
            ip_address: request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown',
            created_at: new Date().toISOString(),
          }
        ])

      return NextResponse.json(
        { error: 'Failed to send email. Please check your email address and try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send ebook error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 