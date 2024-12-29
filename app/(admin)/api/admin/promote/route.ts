import { headers } from 'next/headers';
import { auth } from '@/app/(auth)/auth';
import { getUser, promoteToAdmin } from '@/lib/db/queries';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [currentUser] = await getUser(session.user.email);
  
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    await promoteToAdmin(email);
    return Response.json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 