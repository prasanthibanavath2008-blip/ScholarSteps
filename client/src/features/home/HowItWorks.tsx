import React from 'react';
import { Search, HelpCircle, ListTodo } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Explore reliable state & central schemes',
      desc: 'Browse a catalog of verified opportunities with official source URLs, confirmed deadlines, and benefits.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Understand',
      tagline: 'Answer a short questionnaire',
      desc: 'Our rule-based engine tells you which criteria match, which do not, and what information remains unknown.',
      icon: HelpCircle,
    },
    {
      num: '03',
      title: 'Prepare',
      tagline: 'Build your application checklist',
      desc: 'Mark required documents ready at your own pace. Then proceed directly to the verified official portal to apply.',
      icon: ListTodo,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-canvas border-b border-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-xs font-semibold uppercase tracking-wider border border-border">
            <span>Methodical Workflow</span>
          </div>
          <h2 className="font-section-heading text-ink">A simple path forward</h2>
          <p className="font-large-body text-ink-secondary">
            From discovering verified schemes to organizing your revenue certificates.
          </p>
        </div>

        {/* 3 Step Cards with step-line sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card flex flex-col justify-between relative group hover:border-border-strong hover:shadow-raised transition-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading font-extrabold text-2xl text-primary/70">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-canvas text-primary flex items-center justify-center border border-border">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-card-title text-ink mb-1">{step.title}</h3>
                  <span className="text-xs font-semibold text-primary block mb-3">
                    {step.tagline}
                  </span>
                  <p className="text-sm text-ink-secondary leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-ink-muted">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

