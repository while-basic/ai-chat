import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/auth';
import { getUser, getAllChatsWithMessages } from '@/lib/db/queries';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await getUser(session.user.email);
  
  if (!user?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const chats = await getAllChatsWithMessages();
    return Response.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 