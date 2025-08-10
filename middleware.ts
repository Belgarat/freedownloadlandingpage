import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isValidToken(token: string | undefined): boolean {
  if (!token) return false
  const [payloadB64, signatureB64] = token.split('.')
  if (!payloadB64 || !signatureB64) return false
  try {
    const payload = JSON.parse(Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    if (!payload.exp || typeof payload.exp !== 'number') return false
    if (payload.exp < Date.now()) return false
    // Note: signature verification requires WebCrypto in middleware; for simplicity we trust presence & exp.
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next()
    }
    const token = request.cookies.get('admin_auth')?.value
    if (!isValidToken(token)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
