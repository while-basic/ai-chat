import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authConfig } from '@/app/(auth)/auth.config';
import { adminMiddleware } from './middleware/admin';

const { auth } = NextAuth(authConfig);

export default auth;

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
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminMiddleware(request);
  }

  // Continue with the default auth middleware
  return auth(request);
}
