import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

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

    // Note: We don't mark token as used immediately - it can be used multiple times within 24 hours

    // Track download in analytics
    await supabaseAdmin
      .from('analytics')
      .insert([
        {
          email: tokenData.email,
          action: 'ebook_downloaded',
          timestamp: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'unknown',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          created_at: new Date().toISOString(),
        }
      ])

    // Serve the PDF file
    try {
      const filePath = join(process.cwd(), 'public', 'ebooks', 'fish-cannot-carry-guns-sample.pdf')
      const fileBuffer = readFileSync(filePath)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="fish-cannot-carry-guns-sample.pdf"',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } catch (fileError) {
      console.error('File read error:', fileError)
      return NextResponse.json(
        { error: 'Ebook file not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
} 