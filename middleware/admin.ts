import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import type { Session, User } from 'next-auth';

interface ExtendedUser extends User {
  isAdmin?: boolean;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export async function adminMiddleware(request: NextRequest) {
  const session = await auth() as ExtendedSession | null;
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!session.user.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
} 