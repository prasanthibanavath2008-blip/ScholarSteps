import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { StorageService } from '../../lib/storage';
import { evaluateScholarship } from '@shared/domain/matching';
import { Scholarship } from '@shared/types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  CheckCircle2,
  HelpCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Edit3,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export const MatchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'POTENTIAL' | 'NEEDS_INFO'>('ALL');

  // Load answers from local draft
  const answers = useMemo(() => StorageService.getDraftAnswers(), []);

  // Run pure deterministic matching across all scholarships
  const evaluatedList = useMemo(() => {
    return ALL_SCHOLARSHIPS.map((scholarship) => {
      const evaluation = evaluateScholarship(scholarship, answers);
      return {
        scholarship,
        evaluation,
      };
    });
  }, [answers]);

  // Counts
  const potentialMatches = evaluatedList.filter(
    (item) => item.evaluation.matchStatus === 'POTENTIAL_MATCH'
  );
  const needsInfoMatches = evaluatedList.filter(
    (item) => item.evaluation.matchStatus === 'NEEDS_MORE_INFORMATION'
  );
  const doesNotMatchList = evaluatedList.filter(
    (item) => item.evaluation.matchStatus === 'DOES_NOT_MATCH_CHECKED_CRITERIA'
  );

  // Filter by tab
  const displayedList = useMemo(() => {
    if (activeTab === 'POTENTIAL') return potentialMatches;
    if (activeTab === 'NEEDS_INFO') return needsInfoMatches;
    return evaluatedList;
  }, [activeTab, potentialMatches, needsInfoMatches, evaluatedList]);

  const handleStartPlan = (scholarship: Scholarship) => {
    const existing = StorageService.getPlanByScholarshipId(scholarship.id);
    if (existing) {
      navigate(`/plans/${existing.id}`);
      return;
    }

    const newId = `plan-${scholarship.id}-${Date.now()}`;
    StorageService.savePlan({
      id: newId,
      scholarshipId: scholarship.id,
      scholarshipSlug: scholarship.slug,
      scholarshipName: scholarship.name,
      providerName: scholarship.provider.name,
      versionId: scholarship.version,
      cycleLabel: 'Current Academic Cycle',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officialPortalUrl: scholarship.officialPortalUrl,
      items: scholarship.documents.map((doc, idx) => ({
        id: `item-${doc.id}-${idx}`,
        sourceRequirementId: doc.id,
        title: doc.title,
        description: doc.description,
        requirementType: doc.requirementType,
        applicability: 'APPLICABLE',
        status: 'NOT_STARTED',
        instructionLink: doc.instructionUrl,
      })),
      sourceVersionCheckDate: scholarship.sources[0]?.reviewedAt || new Date().toISOString(),
    });
    navigate(`/plans/${newId}`);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Engine</span>
            </div>
            <h1 className="font-page-title text-ink">Your opportunity shortlist</h1>
            <p className="font-large-body text-ink-secondary mt-1">
              Deterministic evaluation based on the transparent answers you shared.
            </p>
          </div>

          <Link to="/find">
            <Button variant="secondary" leftIcon={<Edit3 className="w-4 h-4" />}>
              Edit my answers
            </Button>
          </Link>
        </div>

        {/* Summary Metric Tiles (SDD Section 8.7) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setActiveTab('POTENTIAL')}
            className={`p-5 rounded-card border shadow-card transition-colors cursor-pointer ${
              activeTab === 'POTENTIAL'
                ? 'bg-primary-tint/50 border-primary'
                : 'bg-surface border-border hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-ink-muted">
                Potential Matches
              </span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div className="font-heading font-bold text-2xl text-ink mt-2">
              {potentialMatches.length}
            </div>
            <span className="text-xs text-ink-secondary mt-1 block">
              All checked criteria pass
            </span>
          </div>

          <div
            onClick={() => setActiveTab('NEEDS_INFO')}
            className={`p-5 rounded-card border shadow-card transition-colors cursor-pointer ${
              activeTab === 'NEEDS_INFO'
                ? 'bg-warning-tint/50 border-warning'
                : 'bg-surface border-border hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-ink-muted">
                Information Needed
              </span>
              <HelpCircle className="w-4 h-4 text-warning" />
            </div>
            <div className="font-heading font-bold text-2xl text-ink mt-2">
              {needsInfoMatches.length}
            </div>
            <span className="text-xs text-ink-secondary mt-1 block">
              Some criteria unanswered
            </span>
          </div>

          <div
            onClick={() => setActiveTab('ALL')}
            className={`p-5 rounded-card border shadow-card transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-surface-muted border-border-strong'
                : 'bg-surface border-border hover:border-border-strong'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-ink-muted">
                Does Not Match
              </span>
              <XCircle className="w-4 h-4 text-danger" />
            </div>
            <div className="font-heading font-bold text-2xl text-ink mt-2">
              {doesNotMatchList.length}
            </div>
            <span className="text-xs text-ink-secondary mt-1 block">
              One or more rules did not pass
            </span>
          </div>
        </div>

        {/* Tab Filter bar */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            All Results ({evaluatedList.length})
          </button>
          <button
            onClick={() => setActiveTab('POTENTIAL')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'POTENTIAL'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Potential Matches ({potentialMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('NEEDS_INFO')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'NEEDS_INFO'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Need More Information ({needsInfoMatches.length})
          </button>
        </div>

        {/* Shortlist Result Cards */}
        {displayedList.length > 0 ? (
          <div className="space-y-6 mb-12">
            {displayedList.map(({ scholarship, evaluation }) => {
              const badgeVariant =
                evaluation.matchStatus === 'POTENTIAL_MATCH'
                  ? 'potential-match'
                  : evaluation.matchStatus === 'NEEDS_MORE_INFORMATION'
                  ? 'need-info'
                  : 'no-match';

              return (
                <div
                  key={scholarship.id}
                  className="bg-surface rounded-card border border-border p-6 shadow-card space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                        {scholarship.provider.name}
                      </span>
                      <h3 className="font-card-title text-xl text-ink">
                        <Link
                          to={`/scholarships/${scholarship.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {scholarship.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-ink-secondary">{scholarship.shortSummary}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <Badge variant={badgeVariant} />
                    </div>
                  </div>

                  {/* Why it appears: Rule Evaluation List (SDD Section 8.7 & 7.9) */}
                  <div className="p-4 rounded-control bg-canvas border border-border space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                      Transparent Rule Breakdown
                    </span>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      {evaluation.rules.map((r) => {
                        if (r.result === 'PASS') {
                          return (
                            <div key={r.ruleId} className="flex items-start gap-2 text-success">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{r.explanation}</span>
                            </div>
                          );
                        } else if (r.result === 'FAIL') {
                          return (
                            <div key={r.ruleId} className="flex items-start gap-2 text-danger">
                              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{r.explanation}</span>
                            </div>
                          );
                        } else {
                          return (
                            <div key={r.ruleId} className="flex items-start gap-2 text-warning">
                              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{r.explanation}</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Benefit & Deadline Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-ink-muted">
                      <span className="font-semibold text-ink">
                        Benefit: {scholarship.benefit.headline}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {scholarship.deadlineDate
                            ? `Deadline: ${new Date(scholarship.deadlineDate).toLocaleDateString(
                                'en-IN',
                                { month: 'short', day: 'numeric', year: 'numeric' }
                              )}`
                            : 'Check cycle'}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link to={`/scholarships/${scholarship.slug}`}>
                        <Button variant="secondary" size="sm">
                          View details
                        </Button>
                      </Link>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartPlan(scholarship)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Start preparation plan
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No opportunities found for this view"
            description="You can edit your questionnaire answers or browse the full catalog to inspect all available schemes."
            actionLabel="Browse full catalog"
            onAction={() => navigate('/scholarships')}
          />
        )}

        {/* Matching Limitations Notice (SDD Section 8.7 & 10.3) */}
        <div className="p-6 rounded-card bg-surface border border-border text-xs text-ink-secondary space-y-2">
          <div className="flex items-center gap-2 text-ink font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span>Matching Limitations & Verification Notice</span>
          </div>
          <p className="leading-relaxed">
            This matching analysis evaluates your self-reported responses against publicly documented
            statutory requirements. It does not constitute an official award guarantee or formal
            government decision. Missing criteria are always held in an unknown state. Final
            application, verification, and disbursement are performed directly on the official
            government portal.
          </p>
        </div>
      </div>
    </div>
  );
};
