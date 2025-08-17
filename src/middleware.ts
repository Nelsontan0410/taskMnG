import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/board', '/my-tasks', '/calendar', '/templates', '/reports']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // For protected routes, we'll let the client-side AuthProvider handle the redirect
  // This middleware is mainly for future use when we need server-side checks
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/board/:path*', '/my-tasks/:path*', '/calendar/:path*', '/templates/:path*', '/reports/:path*']
}
