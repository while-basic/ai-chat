'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface Settings {
  maxMessagesPerChat: number;
  maxChatsPerUser: number;
  maxMessageLength: number;
  allowNewUsers: boolean;
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  systemPrompt: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    maxMessagesPerChat: 50,
    maxChatsPerUser: 10,
    maxMessageLength: 2000,
    allowNewUsers: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    systemPrompt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      setSuccess(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="size-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-sm text-success bg-success/10 rounded-md">
          Settings saved successfully
        </div>
      )}

      <div className="grid gap-6">
        {/* Chat Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Chat Settings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Max Messages per Chat
              </label>
              <input
                type="number"
                value={settings.maxMessagesPerChat}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxMessagesPerChat: Number.parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Max Chats per User
              </label>
              <input
                type="number"
                value={settings.maxChatsPerUser}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxChatsPerUser: Number.parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Max Message Length
              </label>
              <input
                type="number"
                value={settings.maxMessageLength}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxMessageLength: Number.parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">User Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.allowNewUsers}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  allowNewUsers: e.target.checked
                }))}
                className="size-4 border rounded"
              />
              <span className="text-sm text-foreground">Allow New User Registration</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  requireEmailVerification: e.target.checked
                }))}
                className="size-4 border rounded"
              />
              <span className="text-sm text-foreground">Require Email Verification</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maintenanceMode: e.target.checked
                }))}
                className="size-4 border rounded"
              />
              <span className="text-sm text-foreground">Maintenance Mode</span>
            </label>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">System Prompt</h2>
          <div>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                systemPrompt: e.target.value
              }))}
              rows={5}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-y"
              placeholder="Enter the default system prompt for AI conversations..."
            />
          </div>
        </div>
      </div>
    </div>
  );
} 