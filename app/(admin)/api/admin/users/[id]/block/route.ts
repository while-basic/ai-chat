import { auth } from '@/lib/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const { isBlocked } = await req.json();

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