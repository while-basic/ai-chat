import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { chat, message, user } from '@/lib/db/schema';
import { count, sql, gte, desc, and, eq } from 'drizzle-orm';
import { subDays } from 'date-fns';

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
    // Total chats (all chats, even without messages)
    const [totalChats] = await db
      .select({ value: count() })
      .from(chat);

    // Total users
    const [totalUsers] = await db
      .select({ value: count() })
      .from(user);

    // Total messages
    const [totalMessages] = await db
      .select({ value: count() })
      .from(message);

    // Active users (users who have chats with messages in the last 7 days)
    const activeDate = subDays(new Date(), 7);
    const [activeUsers] = await db
      .select({
        value: sql`COUNT(DISTINCT ${user.id})`
      })
      .from(user)
      .innerJoin(chat, eq(chat.userId, user.id))
      .innerJoin(message, eq(message.chatId, chat.id))
      .where(gte(message.createdAt, activeDate));

    // Average messages per chat (only for chats with messages)
    const [avgMessagesPerChat] = await db
      .select({
        value: sql<number>`
          CAST(COUNT(${message.id}) AS FLOAT) / 
          NULLIF(COUNT(DISTINCT ${message.chatId}), 0)
        `
      })
      .from(message);

    // Messages by day (last 30 days)
    const messagesByDay = await db
      .select({
        date: sql<string>`DATE(${message.createdAt})`,
        count: count(),
      })
      .from(message)
      .where(gte(message.createdAt, subDays(new Date(), 30)))
      .groupBy(sql`DATE(${message.createdAt})`)
      .orderBy(sql`DATE(${message.createdAt})`);

    // User growth (based on user creation, last 30 days)
    const userGrowth = await db
      .select({
        date: sql<string>`DATE(${chat.createdAt})`,
        count: sql`COUNT(DISTINCT ${user.id})`,
      })
      .from(user)
      .innerJoin(chat, eq(chat.userId, user.id))
      .where(gte(chat.createdAt, subDays(new Date(), 30)))
      .groupBy(sql`DATE(${chat.createdAt})`)
      .orderBy(sql`DATE(${chat.createdAt})`);

    // Chat duration distribution (for chats with 2+ messages)
    const chatDurations = await db
      .select({
        duration: sql<string>`
          CASE 
            WHEN EXTRACT(EPOCH FROM (MAX(${message.createdAt}) - MIN(${message.createdAt})))/60 < 5 THEN '< 5 min'
            WHEN EXTRACT(EPOCH FROM (MAX(${message.createdAt}) - MIN(${message.createdAt})))/60 < 15 THEN '5-15 min'
            WHEN EXTRACT(EPOCH FROM (MAX(${message.createdAt}) - MIN(${message.createdAt})))/60 < 30 THEN '15-30 min'
            ELSE '> 30 min'
          END
        `,
        count: sql`COUNT(DISTINCT ${message.chatId})`,
      })
      .from(message)
      .groupBy(message.chatId)
      .having(sql`COUNT(${message.id}) >= 2`);

    // Format the response
    const formattedStats = {
      totalChats: totalChats.value,
      totalUsers: totalUsers.value,
      totalMessages: totalMessages.value,
      activeUsers: activeUsers.value,
      averageMessagesPerChat: Number(avgMessagesPerChat.value || 0).toFixed(1),
      messagesByDay: messagesByDay.map(day => ({
        date: day.date,
        count: Number(day.count)
      })),
      userGrowth: userGrowth.map(growth => ({
        date: growth.date,
        count: Number(growth.count)
      })),
      chatDurations: chatDurations.map(duration => ({
        duration: duration.duration,
        count: Number(duration.count)
      }))
    };

    return Response.json(formattedStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 