import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

export const TrustAndLimitsPanel: React.FC = () => {
  const whatWeHelpWith = [
    'Translating complex government circulars into clear rule criteria.',
    'Transparently checking your study level, state domicile, and income ceilings.',
    'Explaining exactly which information is missing or needs clarification.',
    'Structuring custom document preparation checklists for required certificates.',
    'Tracking task completion status locally without privacy intrusion.',
  ];

  const whatStaysOfficial = [
    'Submitting the official scholarship application.',
    'Uploading official certificates, photos, and signed college forms.',
    'Authenticating Aadhaar biometric credentials.',
    'Determining legal eligibility and disbursing DBT funds.',
    'Handling grievance resolution and institutional e-attestation.',
  ];

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-xs font-semibold uppercase tracking-wider border border-border">
            <span>Clarity of Purpose</span>
          </div>
          <h2 className="font-section-heading text-ink">
            What we help with & what remains on official portals
          </h2>
          <p className="font-large-body text-ink-secondary">
            We believe in complete transparency about our role as an independent preparation workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* What we help with */}
          <div className="bg-surface rounded-card border border-primary/30 p-6 sm:p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6 text-primary">
                <div className="w-8 h-8 rounded-lg bg-primary-tint flex items-center justify-center">
                  <Check className="w-5 h-5 font-bold" />
                </div>
                <h3 className="font-card-title text-ink">What ScholarSteps helps with</h3>
              </div>
              <ul className="space-y-3 text-sm text-ink-secondary">
                {whatWeHelpWith.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-xs text-ink-muted">
              Designed for student confidence and preparation readiness.
            </div>
          </div>

          {/* What remains on official portal */}
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6 text-ink-muted">
                <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-ink-secondary" />
                </div>
                <h3 className="font-card-title text-ink">What remains on official portals</h3>
              </div>
              <ul className="space-y-3 text-sm text-ink-secondary">
                {whatStaysOfficial.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-muted mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border text-xs text-ink-muted">
              Always submitted via verified URLs such as NSP, SSP, or MahaDBT.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

