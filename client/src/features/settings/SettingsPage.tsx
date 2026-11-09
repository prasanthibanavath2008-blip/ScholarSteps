import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { StorageService } from '../../lib/storage';
import { Button } from '../../components/ui/Button';
import { Trash2, LogOut, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [cleared, setCleared] = useState(false);

  const handleClearBrowser = () => {
    if (window.confirm('Delete all local preparation plans and saved drafts?')) {
      StorageService.clearAllData();
      setCleared(true);
      setTimeout(() => setCleared(false), 2500);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="mb-8 pb-4 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
            Preferences & Controls
          </span>
          <h1 className="font-page-title text-2xl text-ink">Account & Workspace Settings</h1>
          <p className="font-large-body text-ink-secondary mt-1">
            Manage your session, privacy preferences, and stored data.
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Profile Box */}
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-card-title text-lg text-ink">Account Profile</h2>
            <div className="space-y-2 text-sm text-ink-secondary">
              <div className="flex justify-between py-2 border-b border-border/60">
                <span>Display Name:</span>
                <strong className="text-ink">{user?.displayName || 'Guest User'}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span>Email Address:</span>
                <strong className="text-ink">{user?.email || 'Local session (not registered)'}</strong>
              </div>
              <div className="flex justify-between py-2">
                <span>Role:</span>
                <strong className="text-primary font-semibold">{user?.role || 'STUDENT'}</strong>
              </div>
            </div>

            {user && (
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
                  Sign out
                </Button>
              </div>
            )}
          </div>

          {/* Data Sovereignty Box */}
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-card-title text-lg text-ink text-danger">Data Sovereignty & Deletion</h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              ScholarSteps allows you to completely wipe local storage items, reset questionnaire
              answers, and purge preparation checklists.
            </p>

            <div className="pt-2">
              <Button
                variant="destructive"
                onClick={handleClearBrowser}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear all browser data & reset
              </Button>

              {cleared && (
                <p className="mt-2 text-xs text-success font-semibold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All local browser data has been wiped cleanly.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

