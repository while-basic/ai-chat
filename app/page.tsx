import { auth } from '@/app/(auth)/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-4 py-12 text-center md:py-20">
          <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Olive Garden&apos;s
            <br />
            <span className="text-primary">AI Feedback Assistant</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Engage in meaningful conversations about your Olive Garden experience. Share your thoughts, get instant responses, and help us serve you better.
          </p>
          <div className="flex gap-4">
            {session?.user ? (
              <Button size="lg" asChild>
                <Link href="/chat">Start Chatting</Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-12 md:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 font-semibold">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Share your dining experience and get immediate responses from our AI assistant.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 font-semibold">24/7 Availability</h3>
              <p className="text-sm text-muted-foreground">
                Our AI assistant is always here to listen to your feedback, any time of day.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 font-semibold">Personalized Experience</h3>
              <p className="text-sm text-muted-foreground">
                Get tailored responses based on your specific feedback and preferences.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Olive Garden. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 