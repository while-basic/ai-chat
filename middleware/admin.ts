import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { getUser } from '@/lib/db/queries';

export async function adminMiddleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const [user] = await getUser(session.user.email);

  if (!user?.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
} 