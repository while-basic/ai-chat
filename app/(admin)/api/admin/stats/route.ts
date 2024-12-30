import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { chat, message, user } from '@/lib/db/schema';
import { count, sql, gte } from 'drizzle-orm';
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
    // Basic stats with accurate chat count
    const [totalChats] = await db
      .select({ value: sql`COUNT(DISTINCT ${message.chatId})` })
      .from(message);
      
    const [totalUsers] = await db.select({ value: count() }).from(user);
    const [totalMessages] = await db.select({ value: count() }).from(message);

    // Active users (users who have sent a message in the last 7 days)
    const activeDate = subDays(new Date(), 7);
    const [activeUsers] = await db
      .select({ value: count(user.id) })
      .from(user)
      .innerJoin(chat, sql`${chat.userId} = ${user.id}`)
      .innerJoin(message, sql`${message.chatId} = ${chat.id}`)
      .where(gte(message.createdAt, activeDate));

    // Average messages per chat
    const [avgMessagesPerChat] = await db
      .select({
        value: sql<number>`CAST(COUNT(${message.id}) AS FLOAT) / COUNT(DISTINCT ${message.chatId})`
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

    // User growth (last 30 days) - based on first message date
    const userGrowth = await db
      .select({
        date: sql<string>`DATE(MIN(${message.createdAt}))`,
        count: sql`COUNT(DISTINCT ${chat.userId})`,
      })
      .from(chat)
      .innerJoin(message, sql`${message.chatId} = ${chat.id}`)
      .where(gte(message.createdAt, subDays(new Date(), 30)))
      .groupBy(sql`DATE(MIN(${message.createdAt}))`)
      .orderBy(sql`DATE(MIN(${message.createdAt}))`);

    // Chat duration distribution
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
        count: count(message.chatId),
      })
      .from(message)
      .groupBy(message.chatId)
      .having(sql`COUNT(${message.id}) >= 2`);

    return Response.json({
      totalChats: totalChats.value,
      totalUsers: totalUsers.value,
      totalMessages: totalMessages.value,
      activeUsers: activeUsers.value,
      averageMessagesPerChat: avgMessagesPerChat.value || 0,
      messagesByDay,
      userGrowth,
      chatDurations,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 