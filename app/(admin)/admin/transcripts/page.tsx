'use client';

import { useEffect, useState } from 'react';
import { Search, Star, ChevronDown, ChevronUp, ChevronRight, User2, Bot } from 'lucide-react';
import { format } from 'date-fns';

interface MessageContent {
  type: string;
  text: string;
}

interface Message {
  id: string;
  role: string;
  content: string | MessageContent[];
  createdAt: string;
}

interface ChatTranscript {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  userEmail: string;
  messages: Message[];
  isStarred?: boolean;
}

function parseMessageContent(content: any): string {
  if (typeof content === 'string') {
    try {
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => (item.text || '').trim())
          .filter(Boolean)
          .join(' ');
      }
      return content;
    } catch {
      return content;
    }
  }
  
  if (Array.isArray(content)) {
    return content
      .map(item => (item.text || '').trim())
      .filter(Boolean)
      .join(' ');
  }

  if (content && typeof content === 'object') {
    return content.text || JSON.stringify(content);
  }

  return String(content || '');
}

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState<ChatTranscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null);
  const [starredTranscripts, setStarredTranscripts] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('/api/admin/transcripts');
      if (!response.ok) throw new Error('Failed to fetch transcripts');
      const data = await response.json();
      setTranscripts(data);
      // Load starred status from localStorage
      const saved = localStorage.getItem('starredTranscripts');
      if (saved) {
        setStarredTranscripts(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error fetching transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (transcriptId: string) => {
    setStarredTranscripts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transcriptId)) {
        newSet.delete(transcriptId);
      } else {
        newSet.add(transcriptId);
      }
      localStorage.setItem('starredTranscripts', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const filteredTranscripts = transcripts
    .filter(transcript => {
      const matchesSearch = 
        transcript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transcript.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transcript.messages.some(msg => 
          typeof msg.content === 'string' && 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDate = dateFilter === 'all' || (() => {
        const date = new Date(transcript.createdAt);
        const today = new Date();
        switch (dateFilter) {
          case 'today':
            return date.toDateString() === today.toDateString();
          case 'week': {
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return date >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return date >= monthAgo;
          }
          default:
            return true;
        }
      })();

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Chat Transcripts</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:items-center">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transcripts..."
              className="pl-10 pr-4 py-2 w-full border rounded-md bg-background text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border rounded-md bg-background text-foreground min-w-[120px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-background text-foreground whitespace-nowrap"
            >
              {sortOrder === 'desc' ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
              <span className="hidden sm:inline">Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transcripts List */}
      <div className="space-y-4">
        {filteredTranscripts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No transcripts found matching your criteria
          </div>
        ) : (
          filteredTranscripts.map(transcript => (
            <div key={transcript.id} className="border rounded-lg hover:border-border/80">
              <div 
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedTranscript(
                  expandedTranscript === transcript.id ? null : transcript.id
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedTranscript(
                      expandedTranscript === transcript.id ? null : transcript.id
                    );
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(transcript.id);
                    }}
                    className="shrink-0 text-muted-foreground hover:text-yellow-400"
                    aria-label={starredTranscripts.has(transcript.id) ? "Unstar transcript" : "Star transcript"}
                  >
                    {starredTranscripts.has(transcript.id) ? (
                      <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="size-5" />
                    )}
                  </button>

                  <div>
                    <h3 className="font-medium text-foreground">
                      {transcript.title || 'Untitled Chat'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {transcript.userEmail} • {format(new Date(transcript.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {transcript.messages.length} messages
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </div>
              </div>

              {expandedTranscript === transcript.id && (
                <div className="border-t p-4 space-y-4">
                  {transcript.messages.map((message) => (
                    <div key={message.id} className="flex gap-4">
                      <div className={`shrink-0 size-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        {message.role === 'user' ? (
                          <User2 className="size-4 text-primary" />
                        ) : (
                          <Bot className="size-4 text-secondary" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {message.role === 'user' ? 'User' : 'AI'}
                        </p>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          {parseMessageContent(message.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 