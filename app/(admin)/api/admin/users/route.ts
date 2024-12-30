import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { chat, message, user } from '@/lib/db/schema';
import { sql, eq, } from 'drizzle-orm';

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
    // Get all users with their chat and message counts
    const users = await db
      .select({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked,
        lastLoginAt: user.lastLoginAt,
        totalChats: sql<number>`COUNT(DISTINCT ${chat.id})`,
        totalMessages: sql<number>`COUNT(DISTINCT ${message.id})`,
      })
      .from(user)
      .leftJoin(chat, eq(chat.userId, user.id))
      .leftJoin(message, eq(message.chatId, chat.id))
      .groupBy(user.id, user.email, user.isAdmin, user.isBlocked, user.lastLoginAt)
      .orderBy(user.email);

    return Response.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 