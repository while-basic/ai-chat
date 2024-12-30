import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';

export default async function HomePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  redirect('/chat/new');
} 