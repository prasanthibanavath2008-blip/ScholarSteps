import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Is ScholarSteps an official government portal?',
      answer:
        'No. ScholarSteps is an independent student discovery and preparation platform. We research, structure, and verify published government and institutional circulars, but we do not accept official applications or disburse funds. We always direct you to the official portal to apply.',
    },
    {
      question: 'Does achieving 100% readiness guarantee I will receive the scholarship?',
      answer:
        'No. Readiness reflects that you have marked all required applicable documents and preparation steps ready in your personal checklist. It does not constitute official verification or selection by the granting department, which conducts its own independent scrutiny and quota allocations.',
    },
    {
      question: 'What does "More information needed" mean in match results?',
      answer:
        'When you answer our questionnaire, any criterion that was left unanswered or that depends on an institution-specific condition is evaluated as "UNKNOWN". We never assume an unanswered criterion is a pass.',
    },
    {
      question: 'Where is my questionnaire and checklist progress stored?',
      answer:
        'In our P0 release, all your responses and preparation plans are saved securely in your browser\'s local storage. Your personal information is not uploaded to any remote server or shared with third parties.',
    },
    {
      question: 'What happens if an official scholarship deadline changes?',
      answer:
        'We record the date and source reference of every opportunity we verify. If an update occurs, our system highlights the review date and prompts you to review the latest official notification on the state or central portal.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-xs font-semibold uppercase tracking-wider border border-border">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-section-heading text-ink">Clear answers to common questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const buttonId = `faq-btn-${idx}`;

            return (
              <div
                key={idx}
                className="bg-canvas border border-border rounded-card overflow-hidden transition-colors"
              >
                <button
                  id={buttonId}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
                >
                  <span className="font-card-title text-base sm:text-lg text-ink font-semibold">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center shrink-0 border border-border transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-primary-tint border-primary/20 text-primary' : 'text-ink-muted'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 sm:px-6 pb-6 text-sm text-ink-secondary leading-relaxed border-t border-border/50 pt-4"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

