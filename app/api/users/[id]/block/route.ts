import { auth } from '@/lib/auth';
import { db, getUser } from '@/lib/db/queries';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const [currentUser] = await getUser(session.user.email);
    if (!currentUser?.isAdmin) {
      return new Response('Forbidden', { status: 403 });
    }

    const { isBlocked } = await req.json();
    await db
      .update(user)
      .set({ isBlocked })
      .where(eq(user.id, params.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating user block status:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 