'use client';

import { useEffect, useState } from 'react';
import { Search, MoreVertical, Shield, User2, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  lastLoginAt: string | null;
  totalChats: number;
  totalMessages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });
      
      if (!response.ok) throw new Error('Failed to update user role');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      
      if (!response.ok) throw new Error('Failed to update user status');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border rounded-md bg-background text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Chats</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Messages</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map(user => (
                <tr key={user.id} className="bg-background hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.isAdmin ? (
                          <Shield className="size-4 text-primary" />
                        ) : (
                          <User2 className="size-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.isAdmin ? 'Admin' : 'User'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {user.isBlocked ? (
                        <XCircle className="size-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="size-4 text-success" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM d, yyyy h:mm a') : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.totalChats.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.totalMessages.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUserRole(user.id, user.isAdmin)}
                        className="text-sm px-2 py-1 rounded hover:bg-muted"
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleUserBlock(user.id, user.isBlocked)}
                        className="text-sm px-2 py-1 rounded hover:bg-muted text-destructive"
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 