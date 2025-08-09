import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for the main admin page (login)
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next()
    }

    // For all other admin routes, check for authentication
    // In production, you would check for a proper session/token
    // For now, we'll use a simple approach with cookies or headers
    
    // You can implement proper authentication here
    // For example, check for a valid session token
    
    // For development, we'll allow access but you should implement proper auth
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
