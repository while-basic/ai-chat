/*
 * This is an admin route handler for blocking/unblocking users.
 * Currently not in use, but can be uncommented when user moderation features are needed.
 * 
 * Endpoint: PATCH /api/users/[id]/block
 * Purpose: Allows administrators to toggle a user's blocked status
 */

/*
import { auth } from '@/lib/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

type RouteParams = {
  id: string;
};

export async function PATCH(
  _: Request,
  { params }: { params: RouteParams }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [currentUser] = await getUser(session.user.email);
    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { isBlocked } = await _.json();
    await db
      .update(user)
      .set({ isBlocked })
      .where(eq(user.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user block status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
*/ 