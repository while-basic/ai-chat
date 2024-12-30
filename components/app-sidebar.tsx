'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';

interface AppSidebarProps {
  user?: User & { isAdmin?: boolean };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <BetterTooltip content="New Chat" align="start">
            <Button
              variant="outline"
              className="size-10"
              onClick={() => {
                setOpenMobile(false);
                router.push('/');
              }}
            >
              <PlusIcon />
            </Button>
          </BetterTooltip>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarHistory user={user} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user?.isAdmin && (
          <Link
            href="/admin"
            className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-md mb-2"
            onClick={() => setOpenMobile(false)}
          >
            Admin Panel
          </Link>
        )}
        <SidebarUserNav user={user as User} />
      </SidebarFooter>
    </Sidebar>
  );
}
