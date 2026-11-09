import React from 'react';
import { BookOpen, FileCheck, CheckCircle } from 'lucide-react';

export const ValueStrip: React.FC = () => {
  const items = [
    {
      icon: BookOpen,
      title: 'Understand requirements',
      desc: 'Plain-language breakdowns of income ceilings, board score cutoffs, and state domicile rules.',
    },
    {
      icon: FileCheck,
      title: 'Prepare clearly',
      desc: 'Personalized checklists covering RD certificates, bonafides, and Aadhaar bank mapper statuses.',
    },
    {
      icon: CheckCircle,
      title: 'Keep progressing',
      desc: 'Track completed tasks locally without mandatory accounts or intrusive personal document uploads.',
    },
  ];

  return (
    <section className="bg-surface border-b border-border py-10 sm:py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-card-title text-base text-ink">{item.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

