import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';

export default async function NewChatPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login');
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId = models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  redirect(`/chat/${id}`);
} 