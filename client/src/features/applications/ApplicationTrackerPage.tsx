import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../lib/storage';
import { PreparationPlan, ApplicationStage } from '@shared/types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Send,
  Award,
  AlertCircle,
} from 'lucide-react';

export const ApplicationTrackerPage: React.FC = () => {
  const [plans, setPlans] = useState<PreparationPlan[]>([]);
  const [submitModalPlan, setSubmitModalPlan] = useState<PreparationPlan | null>(null);

  useEffect(() => {
    setPlans(StorageService.getPlans());
  }, []);

  const stages: { key: ApplicationStage; label: string; icon: any; color: string }[] = [
    { key: 'PREPARING', label: 'Preparing Documents', icon: Clock, color: 'text-warning' },
    { key: 'READY_TO_APPLY', label: 'Ready to Apply', icon: CheckCircle2, color: 'text-primary' },
    { key: 'SUBMITTED', label: 'Submitted on Portal', icon: Send, color: 'text-info' },
    { key: 'AWARDED', label: 'Awarded / Verified', icon: Award, color: 'text-success' },
  ];

  const handleStageSelect = (plan: PreparationPlan, stage: ApplicationStage) => {
    if (stage === 'SUBMITTED') {
      setSubmitModalPlan(plan);
      return;
    }

    updatePlanStage(plan.id, stage);
  };

  const updatePlanStage = (planId: string, stage: ApplicationStage) => {
    const updated = plans.map((p) => (p.id === planId ? { ...p, stage } : p));
    setPlans(updated);
    const plan = updated.find((p) => p.id === planId);
    if (plan) {
      StorageService.savePlan(plan);
    }
    setSubmitModalPlan(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
            Milestones & Tracking
          </span>
          <h1 className="font-page-title text-2xl text-ink">Application Stage Tracker</h1>
          <p className="font-large-body text-ink-secondary mt-1">
            Self-reported application progress. Track from initial preparation through verified portal
            submission.
          </p>
        </div>

        {plans.length > 0 ? (
          <div className="space-y-6">
            {plans.map((plan) => {
              const currentStage = plan.stage || 'PREPARING';

              return (
                <div
                  key={plan.id}
                  className="bg-surface rounded-card border border-border p-6 shadow-card space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                        {plan.providerName}
                      </span>
                      <h3 className="font-card-title text-lg text-ink">{plan.scholarshipName}</h3>
                      <span className="text-xs text-ink-muted">Cycle: {plan.cycleLabel}</span>
                    </div>

                    <a
                      href={plan.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Official Portal
                      </Button>
                    </a>
                  </div>

                  {/* Stage Progress Bar / Stepper */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stages.map((st) => {
                      const isCurrent = currentStage === st.key;
                      const Icon = st.icon;

                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleStageSelect(plan, st.key)}
                          className={`p-3.5 rounded-control border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-primary-tint border-primary shadow-sm ring-1 ring-primary'
                              : 'bg-canvas border-border hover:border-border-strong hover:bg-surface-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-4 h-4 ${st.color}`} />
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-surface px-1.5 py-0.5 rounded border border-primary/20">
                                Current
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isCurrent ? 'text-primary' : 'text-ink'
                            }`}
                          >
                            {st.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-ink-muted">
                    <span>
                      All stages are self-reported for your organization and do not replace official
                      portal status tracking.
                    </span>
                    <Link
                      to={`/plans/${plan.id}`}
                      className="text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Open checklist</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface rounded-card border border-border p-12 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-card-title text-ink">No active applications to track</h3>
            <p className="text-sm text-ink-secondary">
              Create a preparation plan from any verified opportunity to begin tracking application milestones.
            </p>
            <Link to="/scholarships" className="inline-block pt-2">
              <Button variant="primary">Explore Scholarships</Button>
            </Link>
          </div>
        )}

        {/* Confirmation Modal before marking SUBMITTED (SDD Section 7.14) */}
        <Modal
          isOpen={Boolean(submitModalPlan)}
          onClose={() => setSubmitModalPlan(null)}
          title="Confirm application submission"
          description={`Record submission for ${submitModalPlan?.scholarshipName}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-info-tint border border-info/20 rounded-control text-xs text-info flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Please verify that you have submitted all forms, uploaded revenue documents, and
                obtained an official acknowledgement receipt from the state portal before confirming.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSubmitModalPlan(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => submitModalPlan && updatePlanStage(submitModalPlan.id, 'SUBMITTED')}
              >
                Confirm Submitted
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
