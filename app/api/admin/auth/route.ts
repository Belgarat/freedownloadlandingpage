import { NextResponse } from 'next/server'

function base64UrlEncode(data: string | Uint8Array): string {
  const str = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data)
  return str.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const expected = process.env.ADMIN_PASSWORD || 'admin123'
    if (!password || password !== expected) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const secret = process.env.ADMIN_SECRET || 'change-me-secret'
    const exp = Date.now() + 24 * 60 * 60 * 1000
    const payloadObj = { exp }
    const payload = base64UrlEncode(JSON.stringify(payloadObj))

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
    const signature = base64UrlEncode(new Uint8Array(signatureBuf))
    const token = `${payload}.${signature}`

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Auth failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get admin password from environment
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured')
      return NextResponse.json(
        { error: 'Admin configuration missing' },
        { status: 500 }
      )
    }

    // Simple password comparison
    if (password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 