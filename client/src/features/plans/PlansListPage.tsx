import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../lib/storage';
import { PreparationPlan } from '@shared/types';
import { calculateReadiness } from '@shared/domain/readiness';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Compass,
  Trash2,
} from 'lucide-react';

export const PlansListPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PreparationPlan[]>([]);

  useEffect(() => {
    setPlans(StorageService.getPlans());
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all preparation plans on this browser?')) {
      StorageService.clearAllData();
      setPlans([]);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (SDD Section 8.8) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </div>
            <h1 className="font-page-title text-ink">My preparation</h1>
            <p className="font-large-body text-ink-secondary mt-1">
              One clear next step at a time. Organize required documents before applying on official portals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/scholarships">
              <Button variant="secondary" leftIcon={<Compass className="w-4 h-4" />}>
                Explore opportunities
              </Button>
            </Link>
          </div>
        </div>

        {/* Browser storage notice (SDD Section 4.1 & 8.8) */}
        <div className="p-4 rounded-control bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-muted mb-8 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong>Local Browser Storage:</strong> Progress is saved on this browser. It is not
              automatically synced across devices.
            </span>
          </div>

          {plans.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-danger hover:underline font-medium inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear browser data</span>
            </button>
          )}
        </div>

        {/* Plans Grid or Empty State */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const score = calculateReadiness(plan.items);
              const nextAction =
                plan.items.find((i) => i.status !== 'READY')?.title ||
                'All checklist tasks marked ready';

              return (
                <div
                  key={plan.id}
                  className="bg-surface rounded-card border border-border p-6 shadow-card flex flex-col justify-between hover:border-border-strong hover:shadow-raised transition-card group"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                        {plan.providerName}
                      </span>
                      <h3 className="font-card-title text-lg text-ink line-clamp-2">
                        {plan.scholarshipName}
                      </h3>
                      <span className="text-xs text-ink-muted mt-1 block">
                        Saved Cycle: {plan.cycleLabel} (v{plan.versionId}.0)
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 p-3 rounded-control bg-canvas border border-border">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-ink">{score.label}</span>
                        <span className="font-mono font-bold text-ink">{score.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            score.isFullyReady ? 'bg-success' : 'bg-primary'
                          } transition-progress`}
                          style={{ width: `${score.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Next Action Box */}
                    <div className="p-3 rounded-control bg-surface-muted/60 border border-border/80 text-xs space-y-1">
                      <span className="font-semibold text-ink-muted uppercase tracking-wider text-[10px]">
                        Next Action:
                      </span>
                      <p className="font-medium text-ink truncate">{nextAction}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-6 flex items-center justify-between">
                    <span className="text-xs text-ink-muted">
                      Updated: {new Date(plan.updatedAt).toLocaleDateString('en-IN')}
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/plans/${plan.id}`)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Your next step starts here"
            description="You have not created any scholarship preparation plans yet. Explore verified opportunities to begin building your document readiness checklist."
            actionLabel="Explore scholarships"
            onAction={() => navigate('/scholarships')}
          />
        )}
      </div>
    </div>
  );
};
