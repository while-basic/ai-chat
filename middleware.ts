import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const token = await getToken({ req: request });
      
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (!token.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue with other routes
  return NextResponse.next();
}
