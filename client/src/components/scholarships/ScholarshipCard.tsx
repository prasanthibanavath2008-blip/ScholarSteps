import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '@shared/types';
import { Badge } from '../ui/Badge';
import { Bookmark, Calendar, ArrowRight, Check } from 'lucide-react';
import { StorageService } from '../../lib/storage';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSaveToggle?: () => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const [isSaved, setIsSaved] = useState(() => {
    return Boolean(StorageService.getPlanByScholarshipId(scholarship.id));
  });

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If already exists as a plan, do nothing or notify; if not, create initial plan
    if (!isSaved) {
      StorageService.savePlan({
        id: `plan-${scholarship.id}-${Date.now()}`,
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
      setIsSaved(true);
    }
  };

  const formattedDate = scholarship.deadlineDate
    ? new Date(scholarship.deadlineDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Check official cycle';

  const reviewedDate = scholarship.sources[0]?.reviewedAt
    ? new Date(scholarship.sources[0].reviewedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <div className="bg-surface rounded-card border border-border p-5 sm:p-6 shadow-card transition-card hover:border-border-strong hover:shadow-raised flex flex-col justify-between h-full relative group">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {scholarship.provider.name}
          </span>
          <button
            onClick={handleSaveClick}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-primary-tint border-primary/30 text-primary'
                : 'bg-surface border-border text-ink-muted hover:text-ink hover:border-border-strong'
            }`}
            title={isSaved ? 'Saved in preparation workspace' : 'Save to preparation workspace'}
            aria-label={isSaved ? 'Saved in preparation workspace' : 'Save to preparation workspace'}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Synthetic Fixture Indicator (Section 5.4 & 26) */}
        {scholarship.isSynthetic && (
          <div className="mb-2">
            <Badge variant="synthetic" label="Synthetic demonstration fixture" />
          </div>
        )}

        {/* Title */}
        <h3 className="font-card-title text-ink mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/scholarships/${scholarship.slug}`} className="focus:outline-none">
            {scholarship.name}
          </Link>
        </h3>

        {/* Short Summary */}
        <p className="text-sm text-ink-secondary mb-4 line-clamp-2 leading-relaxed">
          {scholarship.shortSummary}
        </p>

        {/* Badges: Study Level & Availability */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted border border-border text-ink-secondary">
            {scholarship.studyLevel}
          </span>
          <Badge
            variant={scholarship.availability === 'OPEN' ? 'open' : 'closed'}
            label={scholarship.availability === 'OPEN' ? 'Open cycle' : 'Check cycle'}
          />
        </div>

        {/* Benefit Highlight Box */}
        <div className="p-3 rounded-control bg-primary-tint/30 border border-primary/10 mb-4">
          <span className="text-xs font-semibold text-primary block mb-0.5">Estimated Benefit</span>
          <p className="text-sm font-semibold text-ink leading-snug">{scholarship.benefit.headline}</p>
        </div>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-4 border-t border-border flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Deadline: {formattedDate}</span>
          </span>
          <span>Verified: {reviewedDate}</span>
        </div>

        <Link
          to={`/scholarships/${scholarship.slug}`}
          className="inline-flex items-center justify-between w-full text-sm font-medium text-primary hover:text-primary-hover p-2 -mx-2 rounded-lg hover:bg-primary-tint/40 transition-colors"
        >
          <span>View opportunity & requirements</span>
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

