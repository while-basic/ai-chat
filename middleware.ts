import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  // Check if the request is for a public file
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if the request is for the auth pages
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Check if the request is for the admin pages
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Continue with the default auth middleware
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
