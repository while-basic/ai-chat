import { cookies } from 'next/headers';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { convertToUIMessages } from '@/lib/utils';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { User } from '@/lib/types/user';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage(props: PageProps) {
  const { id } = await props.params;
  const session = await auth();
  const user = session?.user as User | null;

  if (!user?.email) {
    return null;
  }

  const chat = await getChatById({ id });

  if (!chat) {
    return null;
  }

  const messages = await getMessagesByChatId({ id });
  
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId = models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={chat.id}
      initialMessages={convertToUIMessages(messages)}
      selectedModelId={selectedModelId}
      user={user}
    />
  );
}
