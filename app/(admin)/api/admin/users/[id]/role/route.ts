import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
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
    const { isAdmin } = await request.json();

    // Update user role
    await db
      .update(user)
      .set({ isAdmin })
      .where(eq(user.id, params.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 