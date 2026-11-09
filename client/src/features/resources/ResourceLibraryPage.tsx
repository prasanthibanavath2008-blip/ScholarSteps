import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, FileText, CheckSquare, HelpCircle } from 'lucide-react';

export const ResourceLibraryPage: React.FC = () => {
  const articles = [
    {
      slug: 'understanding-rd-certificates',
      title: 'A Student Guide to Karnataka Revenue RD Numbers',
      summary: 'Learn how Atalji Janasnehi Kendras digitize caste and income records, and how the 15-digit RD code is verified on SSP.',
      category: 'Documentation',
      readTime: '4 min read',
      icon: FileText,
    },
    {
      slug: 'npci-aadhaar-seeding-guide',
      title: 'How to Verify NPCI Aadhaar Mapping for Direct Benefit Transfer',
      summary: 'Step-by-step instructions for getting your bank account properly seeded on the NPCI mapper for scholarship grants.',
      category: 'Banking',
      readTime: '3 min read',
      icon: CheckSquare,
    },
    {
      slug: 'income-ceilings-and-documents',
      title: 'Understanding Family Income Ceilings in State Welfare Schemes',
      summary: 'Income limits, Tahsildar declarations, and avoiding common certificate rejection reasons.',
      category: 'Eligibility',
      readTime: '5 min read',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
            Knowledge Base
          </span>
          <h1 className="font-page-title text-2xl text-ink">Scholarship Resource Library</h1>
          <p className="font-large-body text-ink-secondary mt-1 max-w-2xl">
            Reviewed guides explaining official revenue procedures, banking requirements, and document
            preparation workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {articles.map((art) => {
            const Icon = art.icon;
            return (
              <div
                key={art.slug}
                className="bg-surface rounded-card border border-border p-6 shadow-card flex flex-col justify-between hover:border-border-strong hover:shadow-raised transition-card group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center border border-primary/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-ink-muted bg-surface-muted px-2.5 py-0.5 rounded-full border border-border">
                      {art.category}
                    </span>
                  </div>

                  <h3 className="font-card-title text-lg text-ink group-hover:text-primary transition-colors">
                    <Link to={`/resources/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-border mt-6 flex items-center justify-between text-xs">
                  <span className="text-ink-muted">{art.readTime}</span>
                  <Link
                    to={`/resources/${art.slug}`}
                    className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-5 rounded-card bg-surface border border-border text-xs text-ink-secondary space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Reviewed Educational Content</span>
          </div>
          <p className="leading-relaxed">
            All resource guides are researched by team NextStep Rebels based on official statutory
            guidelines from central and state ministries.
          </p>
        </div>
      </div>
    </div>
  );
};
