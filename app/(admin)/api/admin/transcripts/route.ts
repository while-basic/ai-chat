import { auth } from '@/app/(auth)/auth';
import { db, getUser } from '@/lib/db/queries';
import { chat, message, user } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

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
    // Fetch all chats with their messages and user information
    const transcripts = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        userId: chat.userId,
        userEmail: user.email,
        messages: message,
      })
      .from(chat)
      .innerJoin(user, eq(chat.userId, user.id))
      .leftJoin(message, eq(chat.id, message.chatId))
      .orderBy(desc(chat.createdAt));

    // Group messages by chat
    const groupedTranscripts = transcripts.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          title: row.title,
          createdAt: row.createdAt,
          userId: row.userId,
          userEmail: row.userEmail,
          messages: [],
        };
      }
      if (row.messages) {
        acc[row.id].messages.push({
          id: row.messages.id,
          role: row.messages.role,
          content: row.messages.content,
          createdAt: row.messages.createdAt,
        });
      }
      return acc;
    }, {} as Record<string, any>);

    // Sort messages by creation date
    Object.values(groupedTranscripts).forEach(transcript => {
      transcript.messages.sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return Response.json(Object.values(groupedTranscripts));
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 