import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { User } from '@/lib/types/user';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user ? {
    ...session.user,
    isAdmin: false // Default to non-admin
  } as User : null;

  if (!user?.email) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId = models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={params.id}
      initialMessages={[]}
      selectedModelId={selectedModelId}
      user={user}
    />
  );
}
