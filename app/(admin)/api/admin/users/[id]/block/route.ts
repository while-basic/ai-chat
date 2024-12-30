import { NextResponse } from 'next/server';

import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    // Update the user's blocked status
    await db
      .update(user)
      .set({ isBlocked: true })
      .where(eq(user.id, id as string));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error blocking user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 