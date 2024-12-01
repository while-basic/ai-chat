import type { ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';

import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 md:hidden"
      onClick={toggleSidebar}
    >
      <SidebarLeftIcon className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
