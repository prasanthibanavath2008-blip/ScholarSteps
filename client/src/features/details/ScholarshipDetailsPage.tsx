import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getScholarshipBySlug } from '../../lib/catalog';
import { StorageService } from '../../lib/storage';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SourcePanel } from '../../components/ui/SourcePanel';
import { Modal } from '../../components/ui/Modal';
import { AiExplanationModal } from '../../components/scholarships/AiExplanationModal';
import {
  Calendar,
  ExternalLink,
  CheckSquare,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Flag,
} from 'lucide-react';

export const ScholarshipDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportCategory, setReportCategory] = useState('OUTDATED_INFORMATION');
  const [reportText, setReportText] = useState('');

  const scholarship = slug ? getScholarshipBySlug(slug) : undefined;

  if (!scholarship) {
    return (
      <div className="py-20 max-w-content mx-auto px-4 text-center">
        <h2 className="font-page-title text-ink mb-2">Opportunity not found</h2>
        <p className="text-ink-secondary mb-6">
          The requested scholarship could not be found or has been moved.
        </p>
        <Link to="/scholarships">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  // Check if user already has a saved plan for this scholarship
  const existingPlan = StorageService.getPlanByScholarshipId(scholarship.id);

  const handleStartPreparation = () => {
    if (existingPlan) {
      navigate(`/plans/${existingPlan.id}`);
      return;
    }

    // Create new local plan
    const newPlanId = `plan-${scholarship.id}-${Date.now()}`;
    const plan = {
      id: newPlanId,
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
        applicability: 'APPLICABLE' as const,
        status: 'NOT_STARTED' as const,
        instructionLink: doc.instructionUrl,
      })),
      sourceVersionCheckDate: scholarship.sources[0]?.reviewedAt || new Date().toISOString(),
    };

    StorageService.savePlan(plan);
    navigate(`/plans/${newPlanId}`);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportText('');
    }, 1800);
  };

  const formattedDeadline = scholarship.deadlineDate
    ? new Date(scholarship.deadlineDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : scholarship.deadlineNotes || 'Check official cycle notification';

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/scholarships" className="hover:text-primary transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-medium truncate max-w-xs">{scholarship.name}</span>
        </nav>

        {/* Warning Banners if applicable (SDD Section 8.5) */}
        {scholarship.isSynthetic && (
          <div className="mb-6 p-4 rounded-control bg-warning-tint border border-warning/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning text-sm">Synthetic Demonstration Fixture</h4>
              <p className="text-xs text-warning/90 mt-0.5">
                This record is included strictly to demonstrate complex conditions and UI workflows.
                It does not represent an active legal government grant.
              </p>
            </div>
          </div>
        )}

        {/* Header Block */}
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                {scholarship.provider.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={scholarship.availability === 'OPEN' ? 'open' : 'closed'}
                  label={scholarship.availability === 'OPEN' ? 'Open cycle' : 'Cycle closed / checking'}
                />
                <Badge variant="official-source" label="Reviewed Source" />
              </div>
            </div>

            <h1 className="font-page-title text-ink break-words">{scholarship.name}</h1>

            <p className="font-large-body text-ink-secondary max-w-3xl leading-relaxed">
              {scholarship.shortSummary}
            </p>

            <div className="flex items-center flex-wrap gap-3 pt-2 text-xs text-ink-muted border-t border-border/60">
              <span className="font-medium text-ink">Study Level: {scholarship.studyLevel}</span>
              <span>•</span>
              <span>Domicile: {scholarship.domicileStates.join(', ')}</span>
              <span>•</span>
              <span>Version: {scholarship.version}.0</span>
            </div>
          </div>
        </div>

        {/* 12-Column Grid: 8 columns Content, 4 columns Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Overview */}
            <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="font-section-heading text-lg sm:text-xl text-ink">Overview & Purpose</h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                {scholarship.detailedDescription}
              </p>
            </section>

            {/* 2. Benefits Breakdown */}
            <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="font-section-heading text-lg sm:text-xl text-ink">Award Benefits</h2>
              <div className="p-4 rounded-control bg-primary-tint/40 border border-primary/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Benefit Category: {scholarship.benefit.type}
                </span>
                <p className="font-heading font-bold text-lg text-ink">
                  {scholarship.benefit.headline}
                </p>
                {scholarship.benefit.details && (
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {scholarship.benefit.details}
                  </p>
                )}
              </div>
            </section>

            {/* 3. Checked Requirements */}
            <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-section-heading text-lg sm:text-xl text-ink">
                  Checked Eligibility Criteria
                </h2>
                <Link
                  to="/find"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Check potential match in Finder</span>
                </Link>
              </div>

              <div className="space-y-3">
                {scholarship.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-control bg-canvas border border-border flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm text-ink">{rule.label}</strong>
                        <span className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-ink-muted font-mono">
                          {rule.operator} {String(rule.expectedValue)}
                        </span>
                      </div>
                      <p className="text-sm text-ink-secondary">{rule.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Required Documents Checklist */}
            <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-section-heading text-lg sm:text-xl text-ink">
                  Required Documents & Evidence
                </h2>
                <span className="text-xs text-ink-muted">
                  {scholarship.documents.length} verified items
                </span>
              </div>

              <div className="space-y-3">
                {scholarship.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-control bg-canvas border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-sm text-ink">{doc.title}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          doc.requirementType === 'REQUIRED'
                            ? 'bg-danger-tint text-danger'
                            : 'bg-surface-muted text-ink-secondary'
                        }`}
                      >
                        {doc.requirementType}
                      </span>
                    </div>
                    <p className="text-sm text-ink-secondary leading-relaxed">{doc.description}</p>
                    {doc.instructionUrl && (
                      <div className="pt-1">
                        <a
                          href={doc.instructionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <span>Official issuing authority instructions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Official Application Steps */}
            <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="font-section-heading text-lg sm:text-xl text-ink">
                Official Application Sequence
              </h2>
              <div className="space-y-4">
                {scholarship.steps.map((st) => (
                  <div key={st.stepNumber} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-primary-tint text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                      {st.stepNumber}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-card-title text-base text-ink">{st.title}</h4>
                      <p className="text-sm text-ink-secondary leading-relaxed">{st.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Official Sources Panel */}
            <SourcePanel sources={scholarship.sources} />

            {/* 7. Report Issue Link */}
            <div className="flex justify-between items-center p-4 rounded-control bg-surface border border-border text-xs text-ink-muted">
              <span>Noticed a discrepancy or outdated link?</span>
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-primary hover:text-primary-hover font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report an issue with this content</span>
              </button>
            </div>
          </div>

          {/* Action Panel Column (4 cols, sticky below header) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Preparation Summary
                </span>
                <p className="text-sm font-semibold text-ink">{scholarship.benefit.headline}</p>
              </div>

              {/* Deadline Notice */}
              <div className="p-3.5 rounded-control bg-canvas border border-border space-y-1">
                <span className="text-xs text-ink-muted flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Application Deadline:</span>
                </span>
                <strong className="text-sm text-ink block">{formattedDeadline}</strong>
                {scholarship.deadlineNotes && (
                  <p className="text-xs text-ink-muted leading-tight">{scholarship.deadlineNotes}</p>
                )}
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleStartPreparation}
                  leftIcon={<CheckSquare className="w-4 h-4" />}
                >
                  {existingPlan ? 'Open my preparation plan' : 'Start preparation plan'}
                </Button>

                <Link to="/find" className="w-full block">
                  <Button
                    variant="secondary"
                    className="w-full"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Check my potential match
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => setAiModalOpen(true)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
                >
                  Grounded AI Explainer
                </Button>

                <a
                  href={scholarship.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button
                    variant="tertiary"
                    className="w-full text-xs text-ink-secondary hover:text-primary"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Visit official portal ({new URL(scholarship.officialPortalUrl).hostname})
                  </Button>
                </a>
              </div>

              {/* Independent Service Disclaimer */}
              <div className="pt-4 border-t border-border/80 text-xs text-ink-muted space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    ScholarSteps saves your preparation checklist locally on this browser. Official
                    applications must be submitted on the linked portal.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Report Issue Modal (SDD Section 7.22) */}
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Report content issue"
          description={`Submit a report for ${scholarship.name}`}
        >
          {reportSubmitted ? (
            <div className="p-4 bg-success-tint border border-success/30 rounded-control text-success text-sm text-center">
              Thank you! Your content report has been recorded for editorial review.
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="font-label text-ink block mb-1">Issue Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full h-12 rounded-control bg-surface border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  <option value="BROKEN_LINK">Broken or unreachable official URL</option>
                  <option value="OUTDATED_INFORMATION">Outdated deadline or circular dates</option>
                  <option value="INCORRECT_REQUIREMENT">Incorrect income or score requirement</option>
                  <option value="UNCLEAR_INSTRUCTION">Unclear document description</option>
                  <option value="ACCESSIBILITY_ISSUE">Accessibility or contrast issue</option>
                  <option value="OTHER">Other feedback</option>
                </select>
              </div>

              <div>
                <label className="font-label text-ink block mb-1">Details & Description</label>
                <textarea
                  required
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Explain what needs verification or provide the updated official circular link..."
                  className="w-full p-3 rounded-control bg-surface border border-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setReportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Report
                </Button>
              </div>
            </form>
          )}
        </Modal>
        {/* Grounded AI Explainer Modal */}
        <AiExplanationModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          scholarship={scholarship}
        />
      </div>
    </div>
  );
};
