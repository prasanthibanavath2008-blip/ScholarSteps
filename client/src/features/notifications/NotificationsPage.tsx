import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  date: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'SSP Karnataka 2026-27 Notification Active',
      message: 'The post-matric fee reimbursement guidelines have been verified for current academic admissions.',
      link: '/scholarships/ssp-karnataka-postmatric',
      read: false,
      date: 'Today, 10:30 AM',
    },
    {
      id: '2',
      title: 'CSSS NSP Closing Notice',
      message: 'Central Sector Scheme of Scholarships verification cutoff scheduled for November 30 on scholarships.gov.in.',
      link: '/scholarships/nsp-central-sector-scholarship',
      read: false,
      date: 'Yesterday',
    },
    {
      id: '3',
      title: 'Aadhaar NPCI Mapper Advisory',
      message: 'Remember to confirm your Aadhaar seeding with your bank manager before DBT disbursement.',
      read: true,
      date: '3 days ago',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>In-App Alerts</span>
            </div>
            <h1 className="font-page-title text-2xl text-ink">Notifications</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              Source freshness alerts, verified deadline updates, and checklist notifications.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={markAllRead}
            leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
          >
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`p-5 rounded-card border shadow-card transition-all cursor-pointer ${
                n.read
                  ? 'bg-surface border-border text-ink-secondary'
                  : 'bg-primary-tint/30 border-primary/30 text-ink shadow-sm ring-1 ring-primary/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    <h3 className={`font-card-title text-base ${n.read ? 'text-ink' : 'text-primary'}`}>
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed pl-4">{n.message}</p>
                </div>

                <span className="text-[11px] text-ink-muted whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{n.date}</span>
                </span>
              </div>

              {n.link && (
                <div className="mt-3 pl-4">
                  <a
                    href={n.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>View opportunity details</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

