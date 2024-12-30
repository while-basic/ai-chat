import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(request: Request) {
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
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update user block status
    await db
      .update(user)
      .set({ isBlocked })
      .where(eq(user.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating user block status:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 