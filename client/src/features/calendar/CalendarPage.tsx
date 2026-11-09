import React, { useState } from 'react';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { Button } from '../../components/ui/Button';
import { Calendar as CalendarIcon, Download, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  // Collect opportunities with deadline dates
  const events = ALL_SCHOLARSHIPS.filter((s) => s.deadlineDate);

  const handleExportIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NextStep Rebels//ScholarSteps//EN\r\nCALSCALE:GREGORIAN\r\n`;

    for (const s of events) {
      const d = (s.deadlineDate || '').replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\r\nUID:${s.id}@scholarsteps.org\r\nDTSTAMP:${d}T000000Z\r\nDTSTART;VALUE=DATE:${d}\r\nSUMMARY:${s.name} Application Deadline\r\nDESCRIPTION:Official Application Deadline for ${s.name} (${s.provider.name}). Source link: ${s.officialPortalUrl}\r\nURL:${s.officialPortalUrl}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\n`;
    }

    icsContent += `END:VCALENDAR\r\n`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scholarsteps-deadlines.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
              Schedules & Deadlines
            </span>
            <h1 className="font-page-title text-2xl text-ink">Scholarship Calendar</h1>
            <p className="font-large-body text-ink-secondary mt-1">
              Verified cycle dates, closing dates, and standard iCalendar (.ics) integration.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleExportIcs}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {downloaded ? 'Calendar Exported!' : 'Export Calendar (.ics)'}
          </Button>
        </div>

        {/* Agenda Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map((s) => {
            const formattedDate = new Date(s.deadlineDate!).toLocaleDateString('en-IN', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={s.id}
                className="bg-surface rounded-card border border-border p-6 shadow-card space-y-4 hover:border-border-strong transition-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                      {s.provider.name}
                    </span>
                    <h3 className="font-card-title text-base text-ink">{s.name}</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-tint text-primary border border-primary/20 shrink-0">
                    {s.deadlineType}
                  </span>
                </div>

                <div className="p-3.5 rounded-control bg-canvas border border-border flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs text-ink-muted block">Official Portal Closing Date:</span>
                    <strong className="text-sm text-ink">{formattedDate}</strong>
                  </div>
                </div>

                {s.deadlineNotes && (
                  <p className="text-xs text-ink-secondary leading-relaxed bg-surface-muted/60 p-2.5 rounded border border-border/80">
                    {s.deadlineNotes}
                  </p>
                )}

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-ink-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>State notification verified</span>
                  </span>

                  <a
                    href={s.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Check circular</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-control bg-surface border border-border text-xs text-ink-muted flex items-start gap-2 max-w-2xl">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong>Deadline Precision Notice:</strong> Closing dates represent published government
            notification timelines. Always check the official portal at least 48 hours prior to
            portal closing to avoid server congestion or early cutoffs.
          </p>
        </div>
      </div>
    </div>
  );
};

