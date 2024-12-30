'use client';

import { OliveGardenLogo } from './icons';
import { MobileNav } from './mobile-nav';
import { ModelSelector } from './model-selector';
import type { User } from '@/lib/types/user';

export function ChatHeader({ 
  selectedModelId, 
  user 
}: { 
  selectedModelId: string;
  user: User | null;
}) {
  const isAdmin = user?.isAdmin ?? false;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <OliveGardenLogo className="h-6 w-auto" />
      </div>

      <div className="flex items-center gap-2">
        {isAdmin && <ModelSelector selectedModelId={selectedModelId} />}
        <MobileNav isAdmin={isAdmin} />
      </div>
    </header>
  );
}
