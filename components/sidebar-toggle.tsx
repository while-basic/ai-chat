'use client';

import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';
import { BetterTooltip } from './ui/tooltip';

export function SidebarToggle() {
  const { toggleSidebar, setOpenMobile, isMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(true);
    } else {
      toggleSidebar();
    }
  };

  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className="size-9"
      >
        <SidebarLeftIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </BetterTooltip>
  );
}
