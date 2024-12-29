import { auth } from '@/app/(auth)/auth';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/queries';
import { chat, message, user } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [totalChats] = await db.select({ value: count() }).from(chat);
    const [totalUsers] = await db.select({ value: count() }).from(user);
    const [totalMessages] = await db.select({ value: count() }).from(message);

    return Response.json({
      totalChats: totalChats.value,
      totalUsers: totalUsers.value,
      totalMessages: totalMessages.value,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 