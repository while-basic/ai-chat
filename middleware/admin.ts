import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import type { Session, User } from 'next-auth';

interface ExtendedUser extends User {
  isAdmin?: boolean;
  email: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export async function adminMiddleware(request: NextRequest) {
  try {
    const session = await auth() as ExtendedSession | null;
    
    // Check for valid session and user
    if (!session?.user?.email || !session?.user?.id) {
      console.log('No valid session or user:', session);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check for admin status
    if (!session.user.isAdmin) {
      console.log('User is not admin:', session.user.email);
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
} 