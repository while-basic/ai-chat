import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/',
    '/:id',
    '/api/:path*',
    '/login',
    '/register',
    '/admin/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }) as JWT | null;
  const { pathname } = request.nextUrl;

  // Public routes - allow access even without auth
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    // If user is already logged in, redirect to home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!token) {
    // If no token and trying to access protected route, redirect to login
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Admin routes - require admin privileges
  if (pathname.startsWith('/admin')) {
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
