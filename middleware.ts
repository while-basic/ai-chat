import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { adminMiddleware } from './middleware/admin';

// Export the auth middleware as the default middleware
export { auth as default } from '@/lib/auth';

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

// Custom middleware for admin routes
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminMiddleware(request);
  }
}
