import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { type NextRequest } from 'next/server';

export const runtime = 'nodejs';

interface RouteSegmentConfig {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteSegmentConfig
) {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { isBlocked } = await request.json();

    // Update user block status
    await db
      .update(user)
      .set({ isBlocked })
      .where(eq(user.id, params.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating user block status:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 