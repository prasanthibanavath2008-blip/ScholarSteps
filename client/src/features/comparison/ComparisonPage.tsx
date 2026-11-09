import React, { useState } from 'react';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { Compass, CheckCircle2, ShieldCheck, ExternalLink, X } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  // Pre-select top 2 verified opportunities for immediate comparative view
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'ssp-karnataka-postmatric-2026',
    'nsp-central-sector-2026',
  ]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedScholarships = ALL_SCHOLARSHIPS.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-border">
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunity Matrix</span>
          </div>
          <h1 className="font-page-title text-2xl text-ink">Compare Opportunities</h1>
          <p className="font-large-body text-ink-secondary mt-1">
            Side-by-side comparison of benefits, eligibility criteria, required documents, and verified
            deadlines for up to three schemes.
          </p>
        </div>

        {/* Opportunity Selector Chips */}
        <div className="mb-8 p-4 rounded-card bg-surface border border-border space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
            Select Schemes to Compare (Max 3):
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_SCHOLARSHIPS.map((s) => {
              const isSelected = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSelect(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-canvas border-border text-ink hover:border-border-strong'
                  }`}
                >
                  <span>{s.name}</span>
                  {isSelected && <X className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-side comparison table */}
        <div className="bg-surface rounded-card border border-border shadow-card overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-border bg-canvas">
                <th className="p-4 sm:p-5 w-1/4 text-xs font-bold uppercase text-ink-muted">
                  Comparison Attribute
                </th>
                {comparedScholarships.map((s) => (
                  <th key={s.id} className="p-4 sm:p-5 w-1/3 align-top border-l border-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                      {s.provider.name}
                    </span>
                    <h3 className="font-card-title text-base text-ink mt-1">{s.name}</h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Estimated Benefit</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top">
                    <strong className="text-primary block">{s.benefit.headline}</strong>
                    <span className="text-xs text-ink-secondary mt-1 block">
                      Type: {s.benefit.type}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Target Study Level</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted border border-border text-ink">
                      {s.studyLevel}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Domicile State(s)</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top text-xs">
                    {s.domicileStates.join(', ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Checked Criteria</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top">
                    <ul className="space-y-1.5 text-xs text-ink-secondary">
                      {s.rules.map((r) => (
                        <li key={r.id} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{r.label}: {String(r.expectedValue)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Required Documents</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top">
                    <ul className="space-y-1.5 text-xs text-ink-secondary">
                      {s.documents.map((d) => (
                        <li key={d.id} className="truncate">
                          • {d.title}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Portal Deadline</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top text-xs">
                    <strong>
                      {s.deadlineDate
                        ? new Date(s.deadlineDate).toLocaleDateString('en-IN')
                        : 'Check official circular'}
                    </strong>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-ink bg-canvas/30">Official Application</td>
                {comparedScholarships.map((s) => (
                  <td key={s.id} className="p-4 sm:p-5 border-l border-border align-top">
                    <a
                      href={s.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Visit portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-control bg-surface border border-border text-xs text-ink-muted flex items-start gap-2 max-w-2xl">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            ScholarSteps comparison does not rank opportunities as "best" or guarantee selection.
            Terms are presented side-by-side to assist with your personal preparation.
          </p>
        </div>
      </div>
    </div>
  );
};
