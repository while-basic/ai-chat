'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { Chat, Message } from '@/lib/db/schema';

interface ChatWithMessages extends Chat {
  messages: Message[];
}

export default function TranscriptsPage() {
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/admin/chats');
        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Chat Transcripts</h1>
        <div className="mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search chats..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredChats.map((chat) => (
          <div key={chat.id} className="bg-card shadow rounded-lg overflow-hidden border border-border">
            <div className="px-4 py-5 sm:px-6 border-b border-border">
              <h3 className="text-lg leading-6 font-medium text-card-foreground">
                {chat.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Created at {format(new Date(chat.createdAt), 'PPpp')}
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {chat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary/10 ml-auto max-w-[80%]'
                        : 'bg-muted mr-auto max-w-[80%]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {message.role === 'user' ? 'User' : 'Assistant'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'PPpp')}
                      </span>
                    </div>
                    <div className="text-foreground">
                      {typeof message.content === 'string'
                        ? message.content
                        : JSON.stringify(message.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 