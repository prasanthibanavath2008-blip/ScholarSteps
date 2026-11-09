import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../lib/storage';
import { PreparationPlan, ChecklistItemStatus } from '@shared/types';
import { calculateReadiness } from '@shared/domain/readiness';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  CheckSquare,
  ChevronRight,
  ExternalLink,
  Trash2,
  Download,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const PlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<PreparationPlan | undefined>(undefined);
  const [filterTab, setFilterTab] = useState<'ALL' | 'TODO' | 'READY'>('ALL');
  const [userNotes, setUserNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const loaded = StorageService.getPlanById(id);
      if (loaded) {
        setPlan(loaded);
        setUserNotes(loaded.userNotes || '');
      }
    }
  }, [id]);

  if (!plan) {
    return (
      <div className="py-20 max-w-content mx-auto px-4 text-center">
        <h2 className="font-page-title text-ink mb-2">Plan not found</h2>
        <p className="text-ink-secondary mb-6">
          This preparation plan could not be located in your browser's storage.
        </p>
        <Link to="/plans">
          <Button variant="primary">Return to My Preparation</Button>
        </Link>
      </div>
    );
  }

  const readinessScore = calculateReadiness(plan.items);

  const handleStatusChange = (itemId: string, newStatus: ChecklistItemStatus) => {
    const res = StorageService.updateChecklistItem(plan.id, itemId, newStatus);
    if (res.success && res.updatedPlan) {
      setPlan(res.updatedPlan);
      showSavedToast();
    } else {
      setSaveStatus('error');
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    const res = StorageService.updatePlanNotes(plan.id, userNotes);
    if (res.success && res.updatedPlan) {
      setPlan(res.updatedPlan);
      showSavedToast();
    } else {
      setSaveStatus('error');
    }
  };

  const showSavedToast = () => {
    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
  };

  const handleDeletePlan = () => {
    StorageService.deletePlan(plan.id);
    setDeleteModalOpen(false);
    navigate('/plans');
  };

  const filteredItems = plan.items.filter((item) => {
    if (filterTab === 'TODO') return item.status !== 'READY';
    if (filterTab === 'READY') return item.status === 'READY';
    return true;
  });

  const nextActionItem = plan.items.find((i) => i.status !== 'READY');

  const exportText = `SCHOLARSTEPS PREPARATION SUMMARY
Scholarship: ${plan.scholarshipName}
Provider: ${plan.providerName}
Version: v${plan.versionId}.0 (${plan.cycleLabel})
Readiness: ${readinessScore.percentage}% (${readinessScore.label})
Exported Date: ${new Date().toLocaleDateString('en-IN')}

PREPARATION CHECKLIST:
${plan.items
  .map(
    (item, idx) =>
      `${idx + 1}. [${item.status === 'READY' ? 'X' : item.status === 'IN_PROGRESS' ? 'IN PROGRESS' : ' '}] ${
        item.title
      } (${item.requirementType})
   - Status: ${
     item.status === 'READY'
       ? 'Marked ready by student'
       : item.status === 'IN_PROGRESS'
       ? 'In progress'
       : 'Not started'
   }
   - Description: ${item.description}`
  )
  .join('\n\n')}

STUDENT NOTES:
${plan.userNotes || 'No notes added.'}

OFFICIAL APPLICATION PORTAL:
${plan.officialPortalUrl}

* Disclaimer: ScholarSteps readiness reflects student checklist progress, not official eligibility or government verification.
`;

  const handleDownloadSummary = () => {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.scholarshipSlug}-preparation-summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportModalOpen(false);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6" aria-label="Breadcrumb">
          <Link to="/plans" className="hover:text-primary transition-colors">
            My preparation
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-medium truncate max-w-xs">{plan.scholarshipName}</span>
        </nav>

        {/* Plan Header */}
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                {plan.providerName}
              </span>
              <h1 className="font-page-title text-ink break-words">{plan.scholarshipName}</h1>
              <p className="text-xs text-ink-muted">
                Saved Cycle: <strong>{plan.cycleLabel}</strong> • Version {plan.versionId}.0
              </p>
            </div>

            <div className="flex items-center gap-3">
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

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-2 text-ink-muted hover:text-danger rounded-lg border border-border hover:border-danger/30 hover:bg-danger-tint transition-colors cursor-pointer"
                title="Delete this plan"
                aria-label="Delete this plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 12-Column Grid: 8 cols Checklist & Notes, 4 cols Readiness Aside */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checklist Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Checklist Box */}
            <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  <h2 className="font-section-heading text-lg sm:text-xl text-ink">
                    Preparation Checklist
                  </h2>
                </div>

                {/* Filter Tabs: All, To Do, Ready */}
                <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setFilterTab('ALL')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filterTab === 'ALL'
                        ? 'bg-surface text-ink shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    All ({plan.items.length})
                  </button>
                  <button
                    onClick={() => setFilterTab('TODO')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filterTab === 'TODO'
                        ? 'bg-surface text-ink shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    To Do ({plan.items.filter((i) => i.status !== 'READY').length})
                  </button>
                  <button
                    onClick={() => setFilterTab('READY')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      filterTab === 'READY'
                        ? 'bg-surface text-ink shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Ready ({plan.items.filter((i) => i.status === 'READY').length})
                  </button>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-control border transition-all ${
                      item.status === 'READY'
                        ? 'bg-success-tint/20 border-success/30'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-warning-tint/20 border-warning/30'
                        : 'bg-canvas border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-card-title text-base text-ink">{item.title}</h4>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              item.requirementType === 'REQUIRED'
                                ? 'bg-danger-tint text-danger'
                                : 'bg-surface-muted text-ink-secondary'
                            }`}
                          >
                            {item.requirementType}
                          </span>
                        </div>
                        <p className="text-sm text-ink-secondary leading-relaxed">
                          {item.description}
                        </p>
                        {item.instructionLink && (
                          <a
                            href={item.instructionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium pt-1"
                          >
                            <span>Issuing instructions & official link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* 3-State Status Selector (SDD Section 7.12 & 8.8) */}
                      <div className="shrink-0 self-start sm:self-center">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as ChecklistItemStatus)
                          }
                          aria-label={`Status for ${item.title}`}
                          className={`h-9 px-3 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer transition-colors ${
                            item.status === 'READY'
                              ? 'bg-success text-white border-success'
                              : item.status === 'IN_PROGRESS'
                              ? 'bg-warning-tint text-warning border-warning/40'
                              : 'bg-surface text-ink border-border hover:border-border-strong'
                          }`}
                        >
                          <option value="NOT_STARTED">Not started</option>
                          <option value="IN_PROGRESS">In progress</option>
                          <option value="READY">Marked ready by you</option>
                        </select>
                      </div>
                    </div>

                    {item.markedReadyAt && (
                      <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-success flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marked ready on {new Date(item.markedReadyAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* User Notes Section */}
            <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-card-title text-lg text-ink">Personal Preparation Notes</h3>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Record certificate reference numbers, visit dates to government offices, or reminders.
                  </p>
                </div>
                {saveStatus === 'saved' && (
                  <span className="text-xs text-success font-semibold flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-xs text-danger font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Failed to save</span>
                  </span>
                )}
              </div>

              <textarea
                rows={4}
                value={userNotes}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
                placeholder="e.g. Visited Nemmadi Kendra on Nov 2nd; revenue officer requested mother's death/separation certificate for income verification..."
                className="w-full p-4 rounded-control bg-canvas border border-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus resize-none"
              />
              <div className="flex justify-between items-center text-xs text-ink-muted">
                <span>Notes are saved automatically when you click outside the box.</span>
                <Button size="sm" variant="secondary" onClick={handleNotesBlur}>
                  Save notes
                </Button>
              </div>
            </div>
          </div>

          {/* Aside Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Readiness Card */}
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Your Application Readiness
                </span>
                <ProgressBar score={readinessScore} showDetails={true} />
              </div>

              {/* Next Action Box */}
              <div className="p-3.5 rounded-control bg-primary-tint/50 border border-primary/20 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                  Next Recommended Action:
                </span>
                <p className="text-xs font-semibold text-ink leading-snug">
                  {nextActionItem ? nextActionItem.title : 'All checklist items marked ready!'}
                </p>
                {nextActionItem && (
                  <p className="text-[11px] text-ink-secondary mt-1">
                    {nextActionItem.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setExportModalOpen(true)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Export summary
                </Button>

                <a
                  href={plan.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Open official portal
                  </Button>
                </a>
              </div>

              {/* Browser Storage Notice */}
              <div className="pt-4 border-t border-border/80 text-xs text-ink-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Saved on this browser. Task readiness reflects your own self-reported preparation,
                  not official eligibility decisions.
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Delete Plan Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete preparation plan?"
          description={`This will remove "${plan.scholarshipName}" and all your checklist progress from this browser.`}
        >
          <div className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Are you sure? This action cannot be undone. You can re-create the plan anytime from the
              Scholarship Details page.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Keep Plan
              </Button>
              <Button variant="destructive" onClick={handleDeletePlan}>
                Yes, Delete Plan
              </Button>
            </div>
          </div>
        </Modal>

        {/* Export Summary Modal */}
        <Modal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          title="Export preparation summary"
          description="Review or download a plain text summary of your checklist progress."
        >
          <div className="space-y-4">
            <pre className="p-3 bg-canvas border border-border rounded-control text-xs font-mono text-ink overflow-x-auto max-h-60 leading-relaxed">
              {exportText}
            </pre>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setExportModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleDownloadSummary} leftIcon={<Download className="w-4 h-4" />}>
                Download .txt File
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
