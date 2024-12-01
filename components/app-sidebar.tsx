'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

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
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <Sidebar className="w-[280px] border-r border-border bg-card">
        <SidebarHeader className="border-b border-border px-4 py-2">
          <SidebarMenu>
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex items-center space-x-2"
              >
                <span className="text-lg font-semibold hover:text-primary transition-colors">
                  Chatbot
                </span>
              </Link>
              <BetterTooltip content="New Chat" align="start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </BetterTooltip>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarHistory user={user} />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-border p-4">
          {user && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarUserNav user={user} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent side="left" className="w-[280px] p-0">
          <Sidebar className="border-none">
            <SidebarHeader className="border-b border-border px-4 py-2">
              <SidebarMenu>
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => {
                      setOpenMobile(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-lg font-semibold hover:text-primary transition-colors">
                      Chatbot
                    </span>
                  </Link>
                  <BetterTooltip content="New Chat" align="start">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setOpenMobile(false);
                        router.push('/');
                        router.refresh();
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </BetterTooltip>
                </div>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-4">
              <SidebarGroup>
                <SidebarHistory user={user} />
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-4">
              {user && (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarUserNav user={user} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SidebarFooter>
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}
