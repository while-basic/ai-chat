import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your AI-Powered Chat Assistant
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Experience intelligent conversations with our advanced AI chatbot. Fast, reliable, and always ready to help.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button className="px-8">
                  Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/while-basic/ai-chat" target="_blank">
                <Button variant="outline" className="px-8">
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Natural Conversations</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Engage in fluid, context-aware conversations that feel natural and intuitive.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">24/7 Availability</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access your AI assistant anytime, anywhere, with consistent performance.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your conversations are protected with enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Start?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join thousands of users who are already experiencing the future of AI chat.
              </p>
            </div>
            <Link href="/login">
              <Button className="px-8">
                Start Chatting <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
