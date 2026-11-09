import React from 'react';
import { SourceReference } from '@shared/types';
import { ExternalLink, ShieldCheck, Calendar, Info } from 'lucide-react';
import { Badge } from './Badge';

export interface SourcePanelProps {
  sources: SourceReference[];
  title?: string;
  showDisclaimer?: boolean;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({
  sources,
  title = 'Official Source Provenance',
  showDisclaimer = true,
}) => {
  return (
    <div className="bg-surface rounded-card border border-border p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-card-title text-ink flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
          <span>{title}</span>
        </h3>
        <span className="text-xs text-ink-muted">Independent research archive</span>
      </div>

      <div className="space-y-4">
        {sources.map((src) => {
          const formattedDate = new Date(src.reviewedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={src.id}
              className="p-4 rounded-control bg-surface-muted/50 border border-border text-sm flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold text-ink">{src.organization}</span>
                <Badge
                  variant={src.freshness === 'REVIEWED' ? 'official-source' : 'review-due'}
                  label={src.freshness === 'REVIEWED' ? 'Reviewed' : 'Review due'}
                />
              </div>

              <p className="text-ink-secondary text-xs italic bg-surface p-2.5 rounded border border-border/60">
                "{src.excerpt}"
              </p>

              {src.notes && <p className="text-xs text-ink-muted">Note: {src.notes}</p>}

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs flex-wrap gap-2">
                <span className="text-ink-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last verified: {formattedDate}</span>
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1"
                >
                  <span>Visit official website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {showDisclaimer && (
        <div className="p-3 bg-info-tint/60 rounded-control border border-info/20 text-xs text-info flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            ScholarSteps is an independent guidance tool. We do not issue scholarships, process applications, or make official eligibility determinations. Always verify critical terms on the linked government portal.
          </p>
        </div>
      )}
    </div>
  );
};

