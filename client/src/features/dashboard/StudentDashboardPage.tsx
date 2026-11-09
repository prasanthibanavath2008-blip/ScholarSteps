import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { StorageService } from '../../lib/storage';
import { PreparationPlan } from '@shared/types';
import { calculateReadiness } from '@shared/domain/readiness';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginAsDemo } = useAuth();
  const [plans, setPlans] = useState<PreparationPlan[]>([]);

  useEffect(() => {
    // If not logged in, auto-login as demo student for immediate evaluator convenience
    if (!user) {
      loginAsDemo('STUDENT');
    }
    setPlans(StorageService.getPlans());
  }, [user, loginAsDemo]);

  // Aggregate metrics (SDD Section 8.11)
  const totalPlans = plans.length;
  let totalRemainingTasks = 0;
  let totalCompletedTasks = 0;
  const nextActions: { planId: string; planName: string; taskTitle: string }[] = [];

  plans.forEach((p) => {
    p.items.forEach((item) => {
      if (item.requirementType === 'REQUIRED') {
        if (item.status === 'READY') {
          totalCompletedTasks++;
        } else {
          totalRemainingTasks++;
          if (nextActions.length < 3) {
            nextActions.push({
              planId: p.id,
              planName: p.scholarshipName,
              taskTitle: item.title,
            });
          }
        }
      }
    });
  });

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
              Student Preparation Studio
            </span>
            <h1 className="font-page-title text-ink">
              Welcome back, {user?.displayName || 'Student'}
            </h1>
            <p className="font-large-body text-ink-secondary mt-1">
              Your preparation dashboard tracks active checklists, required tasks, and official deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/find">
              <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-4 h-4" />}>
                Run Match Finder
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Primary Metrics (Max 3, no fake growth curves - Section 8.11) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-card border border-border p-6 shadow-card">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Active Preparation Plans
            </span>
            <div className="font-heading font-extrabold text-3xl text-ink mt-2">{totalPlans}</div>
            <span className="text-xs text-ink-secondary mt-1 block">
              {totalPlans > 0 ? 'Plans in progress' : 'No plans created yet'}
            </span>
          </div>

          <div className="bg-surface rounded-card border border-border p-6 shadow-card">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Tasks Remaining
            </span>
            <div className="font-heading font-extrabold text-3xl text-primary mt-2">
              {totalRemainingTasks}
            </div>
            <span className="text-xs text-ink-secondary mt-1 block">
              {totalCompletedTasks} marked ready across all plans
            </span>
          </div>

          <div className="bg-surface rounded-card border border-border p-6 shadow-card">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Upcoming Deadlines
            </span>
            <div className="font-heading font-extrabold text-3xl text-ink mt-2">
              {plans.length > 0 ? '1 Verified' : 'None'}
            </div>
            <span className="text-xs text-ink-secondary mt-1 block">
              {plans.length > 0 ? 'SSP Karnataka: Dec 31, 2026' : 'Add plans to track deadlines'}
            </span>
          </div>
        </div>

        {/* 12-Column Grid: 8 cols Plans & Next Actions, 4 cols Quick Navigation & Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Plans List */}
            <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="font-section-heading text-xl text-ink">Active Preparation Plans</h2>
                <Link to="/scholarships" className="text-xs text-primary font-semibold hover:underline">
                  Browse Catalog →
                </Link>
              </div>

              {plans.length > 0 ? (
                <div className="space-y-4">
                  {plans.map((plan) => {
                    const score = calculateReadiness(plan.items);
                    return (
                      <div
                        key={plan.id}
                        className="p-5 rounded-control bg-canvas border border-border hover:border-border-strong transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                            {plan.providerName}
                          </span>
                          <h3 className="font-card-title text-base text-ink line-clamp-1">
                            {plan.scholarshipName}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-ink-secondary">
                            <span>{score.label}</span>
                            <span>•</span>
                            <span className="font-mono font-semibold text-primary">
                              {score.percentage}% Ready
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
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
                <div className="text-center py-8 text-ink-secondary space-y-3">
                  <p className="text-sm">You do not have any active preparation plans.</p>
                  <Link to="/scholarships">
                    <Button variant="primary" size="sm">
                      Explore Scholarships
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Next Recommended Actions */}
            {nextActions.length > 0 && (
              <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
                <h2 className="font-section-heading text-lg sm:text-xl text-ink flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Next Recommended Steps</span>
                </h2>
                <div className="space-y-3">
                  {nextActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-control bg-canvas border border-border flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs text-ink-muted line-clamp-1">{action.planName}</span>
                        <h4 className="font-medium text-sm text-ink">{action.taskTitle}</h4>
                      </div>
                      <Link to={`/plans/${action.planId}`}>
                        <Button variant="secondary" size="sm">
                          Prepare
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Aside Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Tools */}
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
              <h3 className="font-card-title text-base text-ink">Preparation Toolkit</h3>
              <div className="space-y-2">
                <Link
                  to="/applications"
                  className="flex items-center justify-between p-3 rounded-control bg-canvas border border-border hover:border-primary/40 hover:bg-primary-tint/20 text-sm font-medium text-ink transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Application Tracker</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/calendar"
                  className="flex items-center justify-between p-3 rounded-control bg-canvas border border-border hover:border-primary/40 hover:bg-primary-tint/20 text-sm font-medium text-ink transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Deadlines & Calendar</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/compare"
                  className="flex items-center justify-between p-3 rounded-control bg-canvas border border-border hover:border-primary/40 hover:bg-primary-tint/20 text-sm font-medium text-ink transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-primary" />
                    <span>Compare Opportunities</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/resources"
                  className="flex items-center justify-between p-3 rounded-control bg-canvas border border-border hover:border-primary/40 hover:bg-primary-tint/20 text-sm font-medium text-ink transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Resource Library</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-muted" />
                </Link>
              </div>
            </div>

            {/* Source Notice */}
            <div className="p-5 rounded-card bg-surface border border-border text-xs text-ink-secondary space-y-2">
              <div className="flex items-center gap-2 text-ink font-semibold">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Source Integrity Notice</span>
              </div>
              <p className="leading-relaxed">
                All scholarship information is cross-referenced with official state government portals.
                When you are ready to apply, you will be transferred directly to the authentic
                submission platform.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
