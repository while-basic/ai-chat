import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { auth } from '../(auth)/auth';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="hidden md:flex">
          <AppSidebar user={session?.user} />
        </div>
        <div className="flex flex-1 flex-col">
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
