'use client';

import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Users, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalChats: number;
  totalUsers: number;
  totalMessages: number;
  activeUsers: number;
  averageMessagesPerChat: number;
  messagesByDay: {
    date: string;
    count: number;
  }[];
  userGrowth: {
    date: string;
    count: number;
  }[];
  chatDurations: {
    duration: string;
    count: number;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChats: 0,
    totalUsers: 0,
    totalMessages: 0,
    activeUsers: 0,
    averageMessagesPerChat: 0,
    messagesByDay: [],
    userGrowth: [],
    chatDurations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  const messageChartData = {
    labels: stats.messagesByDay.map(d => d.date),
    datasets: [
      {
        label: 'Messages per Day',
        data: stats.messagesByDay.map(d => d.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const userGrowthData = {
    labels: stats.userGrowth.map(d => d.date),
    datasets: [
      {
        label: 'User Growth',
        data: stats.userGrowth.map(d => d.count),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
    ],
  };

  const chatDurationData = {
    labels: stats.chatDurations.map(d => d.duration),
    datasets: [
      {
        label: 'Chat Duration Distribution',
        data: stats.chatDurations.map(d => d.count),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchStats();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <RefreshCw className="size-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Chats Card */}
        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <MessageSquare className="size-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Chats
                  </dt>
                  <dd className="text-lg font-semibold text-card-foreground">
                    {stats.totalChats.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <Users className="size-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-semibold text-card-foreground">
                    {stats.totalUsers.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <Activity className="size-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Active Users
                  </dt>
                  <dd className="text-lg font-semibold text-card-foreground">
                    {stats.activeUsers.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Messages per Chat */}
        <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <TrendingUp className="size-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Avg Messages/Chat
                  </dt>
                  <dd className="text-lg font-semibold text-card-foreground">
                    {stats.averageMessagesPerChat.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Messages Trend */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">Message Activity Trend</h3>
          <div className="h-[300px]">
            <Line 
              data={messageChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-[300px]">
            <Line 
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Chat Duration Distribution */}
        <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Chat Duration Distribution</h3>
          <div className="h-[300px]">
            <Bar 
              data={chatDurationData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 