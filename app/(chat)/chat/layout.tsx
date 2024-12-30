import { auth } from '@/app/(auth)/auth';
import { MobileNav } from '@/components/mobile-nav';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { redirect } from 'next/navigation';
import type { User } from '@/lib/types/user';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in?next=/chat');
  }

  const user = session.user as User;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <div className="w-full overflow-auto pl-0 duration-300 ease-in-out peer-data-[state=open]:lg:pl-[250px] peer-data-[state=open]:xl:pl-[300px]">
        <div className="sticky top-0 z-50 flex items-center gap-2 w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
          <SidebarToggle />
          <div className="flex-1" />
          <MobileNav isAdmin={user.isAdmin} />
        </div>
        {children}
      </div>
    </div>
  );
} 