'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart,
  },
  {
    name: 'Transcripts',
    href: '/admin/transcripts',
    icon: MessageSquare,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-md"
            >
              {sidebarOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          
          {/* Mobile User Menu */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
            >
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown className="size-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg border hidden group-hover:block">
              <button
                type="button"
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-black/20"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSidebarOpen(false);
            }}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-lg">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <span className="font-semibold text-lg">Admin Panel</span>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-card border-r">
          <div className="p-4 border-b">
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="p-4 border-t">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 p-2 w-full hover:bg-muted rounded-md"
              >
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown className="size-4 ml-auto" />
              </button>
              <div className="absolute bottom-full left-0 mb-2 w-full bg-popover rounded-md shadow-lg border hidden group-hover:block">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </div>
    </div>
  );
} 