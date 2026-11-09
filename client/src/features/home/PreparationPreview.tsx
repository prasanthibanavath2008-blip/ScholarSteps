import React from 'react';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const PreparationPreview: React.FC = () => {
  return (
    <div className="relative mx-auto max-w-md w-full">
      {/* Decorative accent card behind for depth (subtle, no blobs) */}
      <div className="absolute inset-0 bg-primary/5 rounded-panel transform rotate-1 translate-y-2 pointer-events-none border border-border/80" />

      {/* Main card */}
      <div className="relative bg-surface rounded-panel border border-border shadow-raised p-6 space-y-5">
        {/* Top header badge */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-ink uppercase tracking-wide">
              Preparation Workspace
            </span>
          </div>
          <span className="text-[11px] font-medium text-ink-muted bg-surface-muted px-2 py-0.5 rounded-md border border-border">
            Illustrative preview
          </span>
        </div>

        {/* Opportunity Title & Provider */}
        <div>
          <span className="text-xs text-ink-muted font-medium">Target Opportunity</span>
          <h4 className="font-card-title text-ink text-base">
            Karnataka State Scholarship Portal (SSP)
          </h4>
          <span className="text-xs text-ink-secondary">Social Welfare Dept • Fee Reimbursement</span>
        </div>

        {/* Readiness Bar */}
        <div className="space-y-1.5 p-3 rounded-control bg-canvas border border-border">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-ink flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>2 of 3 required tasks marked ready</span>
            </span>
            <span className="font-semibold text-ink font-mono">67%</span>
          </div>
          <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden border border-border/40">
            <div className="h-full bg-primary transition-progress" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Checklist Step Sequence */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-success-tint/40 border border-success/20 text-ink">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span className="line-through text-ink-secondary">
              Review official eligibility guidelines
            </span>
            <span className="ml-auto text-[10px] text-success font-medium">Ready</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface border border-border text-ink">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Generate 15-digit Revenue RD Number</span>
            <span className="ml-auto text-[10px] text-success font-medium">Ready</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-muted/60 border border-border text-ink">
            <Clock className="w-4 h-4 text-warning shrink-0" />
            <span className="font-medium">Verify Aadhaar-NPCI Bank Seeding</span>
            <span className="ml-auto text-[10px] text-warning font-medium">Next step</span>
          </div>
        </div>

        {/* Next Recommended Action Callout */}
        <div className="p-3 rounded-control bg-primary-tint border border-primary/20 flex items-center justify-between text-xs text-primary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-medium">Direct portal link verified for 2026</span>
          </div>
          <span className="text-[11px] font-semibold flex items-center">
            Portal ready <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
};

