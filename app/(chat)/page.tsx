'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a new chat session
    router.push('/chat/new');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Starting new chat...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we set up your chat session.</p>
      </div>
    </div>
  );
}
