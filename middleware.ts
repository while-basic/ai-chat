import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/app/(auth)/auth';

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
};

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin section
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin check should be done in the API routes or server components
    // as Edge Runtime doesn't support direct database access
    return NextResponse.next();
  }

  // Continue with the default auth middleware
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
} 