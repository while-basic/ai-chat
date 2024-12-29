import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export async function adminMiddleware(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!session.user.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
} 