import React, { useState } from 'react';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SOURCES' | 'REPORTS' | 'AUDIT'>('OVERVIEW');
  const [publishedNotice, setPublishedNotice] = useState(false);

  const verified = ALL_SCHOLARSHIPS.filter((s) => !s.isSynthetic);
  const synthetic = ALL_SCHOLARSHIPS.filter((s) => s.isSynthetic);

  const reports = [
    {
      id: 'rep-1',
      scholarship: 'Karnataka State Scholarship Portal (SSP)',
      category: 'OUTDATED_INFORMATION',
      description: 'GoK issued notification extending e-attestation window by 15 days.',
      status: 'PENDING',
      reportedAt: 'Nov 6, 2026',
    },
    {
      id: 'rep-2',
      scholarship: 'AICTE Pragati Scholarship Scheme',
      category: 'UNCLEAR_INSTRUCTION',
      description: 'Clarify if family declaration Form A requires notary stamp.',
      status: 'RESOLVED',
      reportedAt: 'Nov 2, 2026',
    },
  ];

  const auditEvents = [
    {
      id: 'aud-1',
      actor: 'Editorial Lead (admin@scholarsteps.org)',
      action: 'PUBLISH_VERSION',
      entity: 'ssp-karnataka-postmatric (v1.0)',
      timestamp: '2026-10-15 10:00 UTC',
    },
    {
      id: 'aud-2',
      actor: 'Editorial Lead (admin@scholarsteps.org)',
      action: 'VERIFY_SOURCE_LINK',
      entity: 'https://scholarships.gov.in',
      timestamp: '2026-10-18 12:00 UTC',
    },
  ];

  const handleSimulatePublish = () => {
    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 2500);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Editorial Administration</span>
            </div>
            <h1 className="font-page-title text-2xl text-ink">Content & Verification Queue</h1>
            <p className="font-large-body text-ink-secondary mt-1">
              Audit government source links, review community feedback, and manage published versions.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulatePublish}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Draft
          </Button>
        </div>

        {publishedNotice && (
          <div className="mb-6 p-4 rounded-control bg-success-tint border border-success/30 text-success text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>New scholarship draft initialized in editorial sandbox.</span>
          </div>
        )}

        {/* Tab Toolbar */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-8">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('SOURCES')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'SOURCES'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Source Provenance Queue ({verified.length})
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'REPORTS'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Content Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'AUDIT'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
          >
            Audit History ({auditEvents.length})
          </button>
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-surface rounded-card border border-border p-5 shadow-card">
                <span className="text-xs font-semibold text-ink-muted uppercase">Total Published</span>
                <div className="font-heading font-extrabold text-2xl text-ink mt-2">
                  {ALL_SCHOLARSHIPS.length}
                </div>
                <span className="text-xs text-ink-secondary mt-0.5 block">
                  {verified.length} verified, {synthetic.length} synthetic
                </span>
              </div>

              <div className="bg-surface rounded-card border border-border p-5 shadow-card">
                <span className="text-xs font-semibold text-ink-muted uppercase">Verified Sources</span>
                <div className="font-heading font-extrabold text-2xl text-success mt-2">
                  {verified.length}
                </div>
                <span className="text-xs text-ink-secondary mt-0.5 block">Active gazette citations</span>
              </div>

              <div className="bg-surface rounded-card border border-border p-5 shadow-card">
                <span className="text-xs font-semibold text-ink-muted uppercase">Pending Reports</span>
                <div className="font-heading font-extrabold text-2xl text-warning mt-2">1</div>
                <span className="text-xs text-ink-secondary mt-0.5 block">Requires review</span>
              </div>

              <div className="bg-surface rounded-card border border-border p-5 shadow-card">
                <span className="text-xs font-semibold text-ink-muted uppercase">Immutable Versions</span>
                <div className="font-heading font-extrabold text-2xl text-ink mt-2">v1.0</div>
                <span className="text-xs text-ink-secondary mt-0.5 block">Active production schema</span>
              </div>
            </div>

            {/* Catalog Overview Table */}
            <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-card-title text-lg text-ink">Managed Scholarship Catalog</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink-secondary">
                  <thead className="bg-canvas border-b border-border text-xs uppercase font-semibold text-ink-muted">
                    <tr>
                      <th className="p-4">Opportunity</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Version</th>
                      <th className="p-4">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ALL_SCHOLARSHIPS.map((s) => (
                      <tr key={s.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="p-4 font-semibold text-ink">
                          {s.name}
                          {s.isSynthetic && (
                            <span className="ml-2 text-[10px] text-warning bg-warning-tint px-1.5 py-0.5 rounded font-bold">
                              Synthetic
                            </span>
                          )}
                        </td>
                        <td className="p-4">{s.provider.name}</td>
                        <td className="p-4">
                          <Badge variant={s.availability === 'OPEN' ? 'open' : 'closed'} />
                        </td>
                        <td className="p-4 font-mono text-xs">v{s.version}.0</td>
                        <td className="p-4 text-xs">
                          {s.sources[0]?.reviewedAt ? new Date(s.sources[0].reviewedAt).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sources Queue */}
        {activeTab === 'SOURCES' && (
          <div className="space-y-4">
            {verified.map((s) => (
              <div
                key={s.id}
                className="bg-surface rounded-card border border-border p-6 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-ink-muted">{s.provider.name}</span>
                    <h4 className="font-card-title text-base text-ink">{s.name}</h4>
                  </div>
                  <Badge variant="official-source" label="Source Verified" />
                </div>

                <div className="p-3 bg-canvas rounded-control border border-border text-xs space-y-1">
                  <span className="font-semibold text-ink">Official Citation Excerpt:</span>
                  <p className="italic text-ink-secondary font-serif">"{s.sources[0]?.excerpt}"</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="text-ink-muted">
                    Reviewed on {new Date(s.sources[0]?.reviewedAt || '').toLocaleDateString('en-IN')}
                  </span>
                  <a
                    href={s.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Check primary URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="bg-surface rounded-card border border-border p-6 shadow-card flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-warning-tint text-warning border border-warning/30">
                      {r.category}
                    </span>
                    <span className="text-xs text-ink-muted">{r.reportedAt}</span>
                  </div>
                  <h4 className="font-card-title text-base text-ink">{r.scholarship}</h4>
                  <p className="text-sm text-ink-secondary">{r.description}</p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                    r.status === 'PENDING'
                      ? 'bg-warning-tint text-warning border border-warning/30'
                      : 'bg-success-tint text-success border border-success/30'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Audit */}
        {activeTab === 'AUDIT' && (
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <table className="w-full text-left text-sm text-ink-secondary">
              <thead className="bg-canvas border-b border-border text-xs uppercase font-semibold text-ink-muted">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditEvents.map((a) => (
                  <tr key={a.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-primary">{a.action}</td>
                    <td className="p-4">{a.actor}</td>
                    <td className="p-4">{a.entity}</td>
                    <td className="p-4 text-xs font-mono">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
