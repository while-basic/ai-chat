import Link from 'next/link';
import { GithubIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">AI Chat</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm font-medium">
                Get Started
              </Button>
            </Link>
            <Link
              href="https://github.com/while-basic/ai-chat"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <GithubIcon className="h-4 w-4" />
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              © 2024 AI Chat. All rights reserved.
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
