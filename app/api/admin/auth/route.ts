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

export async function GET(request: Request) {
  try {
    // Get the auth cookie from the request
    const cookieHeader = request.headers.get('cookie')
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const token = cookies?.['admin_auth']
    
    if (!token) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
    
    // Verify the token
    const [payloadB64, signatureB64] = token.split('.')
    if (!payloadB64 || !signatureB64) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
    
    try {
      const payload = JSON.parse(Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
      if (!payload.exp || typeof payload.exp !== 'number') {
        return NextResponse.json({ ok: false }, { status: 401 })
      }
      if (payload.exp < Date.now()) {
        return NextResponse.json({ ok: false }, { status: 401 })
      }
      
      // Token is valid
      return NextResponse.json({ ok: true })
    } catch {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Auth check failed' }, { status: 500 })
  }
}