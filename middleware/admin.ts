import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { User } from '@/lib/types/user';

export async function adminMiddleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const user = session.user as User;
  if (!user.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
} 