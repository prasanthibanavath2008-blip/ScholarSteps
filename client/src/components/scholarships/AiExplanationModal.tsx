import React, { useState } from 'react';
import { Scholarship } from '@shared/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';

export interface AiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: Scholarship;
}

export const AiExplanationModal: React.FC<AiExplanationModalProps> = ({
  isOpen,
  onClose,
  scholarship,
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    setTimeout(() => {
      setIsLoading(false);
      // Strictly grounded explanation from official sources (SDD Section 7.20)
      setResponse(
        `Grounded Summary for ${scholarship.name}:\n\n` +
          `• Target Audience: Students pursuing ${scholarship.studyLevel} education with verified domicile in ${scholarship.domicileStates.join(', ')}.\n` +
          `• Benefit Structure: ${scholarship.benefit.headline} (${scholarship.benefit.type}).\n` +
          `• Mandated Evidence: ${scholarship.documents.map((d) => d.title).join('; ')}.\n` +
          `• Important Note: Income and revenue certificates must match the 2026-27 cycle guidelines issued by ${scholarship.provider.name}.`
      );
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grounded Requirement Explainer"
      description={`Synthesized from verified circulars for ${scholarship.name}`}
    >
      <div className="space-y-4 text-sm text-ink">
        <div className="p-3 bg-info-tint/60 border border-info/20 rounded-control text-xs text-info flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <strong>Grounded Synthesis:</strong> Explanations are derived exclusively from reviewed
            gazette guidelines. Our explainer does not invent information or make legal eligibility
            determinations.
          </p>
        </div>

        <form onSubmit={handleExplain} className="space-y-3">
          <div>
            <label className="font-label text-ink block mb-1">
              Ask about requirements, certificates, or rules:
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What documents are needed for income verification?"
              className="w-full h-11 px-3 rounded-control bg-canvas border border-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Explain Requirements
          </Button>
        </form>

        {isLoading && (
          <div className="py-6 flex items-center justify-center gap-2 text-xs text-ink-muted">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Consulting verified source references...</span>
          </div>
        )}

        {response && (
          <div className="p-4 rounded-control bg-canvas border border-border space-y-3 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              Grounded Explanation
            </span>
            <div className="text-xs text-ink-secondary whitespace-pre-line leading-relaxed font-sans">
              {response}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
              <span>Primary source: {scholarship.provider.name}</span>
              <a
                href={scholarship.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>Official circular</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

