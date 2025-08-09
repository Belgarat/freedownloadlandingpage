import { NextRequest, NextResponse } from 'next/server'
import { sendFollowUpEmail } from '@/lib/resend'
import { generateDownloadToken, createDownloadUrl } from '@/lib/download-tokens'
import { supabaseAdmin } from '@/lib/supabase'
import { EmailRequest, EmailResponse } from '@/types/email'

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate fresh download token
    const downloadToken = generateDownloadToken(email)
    const downloadUrl = createDownloadUrl(downloadToken.token)

    // Store new token in database
    const { error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .insert([{
        email: downloadToken.email,
        token: downloadToken.token,
        expires_at: downloadToken.expiresAt.toISOString(),
        used: false,
        created_at: downloadToken.createdAt.toISOString(),
      }])

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.json(
        { error: 'Failed to generate fresh download link' },
        { status: 500 }
      )
    }

    // Send follow-up email
    const result = await sendFollowUpEmail({
      email,
      name,
      downloadUrl
    })

    return NextResponse.json({
      success: true,
      message: 'Follow-up email sent successfully',
      data: { email, messageId: result.messageId }
    })

  } catch (error) {
    console.error('Follow-up email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
