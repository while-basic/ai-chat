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
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = session.user as ExtendedUser;
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
} 