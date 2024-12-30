'use client';

import { BoxIcon } from './icons';
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
        <BoxIcon size={24} />
      </div>

      <div suppressHydrationWarning>
        {isAdmin && (
          <div className="flex items-center justify-end space-x-2">
            <ModelSelector selectedModelId={selectedModelId} />
          </div>
        )}
      </div>
    </header>
  );
}
