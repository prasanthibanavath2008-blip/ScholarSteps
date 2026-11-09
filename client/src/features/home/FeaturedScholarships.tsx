import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedScholarships: React.FC = () => {
  // Take top 3 verified opportunities (non-synthetic)
  const featured = ALL_SCHOLARSHIPS.filter((s) => !s.isSynthetic).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-xs font-semibold uppercase tracking-wider border border-border mb-3">
              <span>Curated Catalog</span>
            </div>
            <h2 className="font-section-heading text-ink">Selected opportunities</h2>
            <p className="font-large-body text-ink-secondary mt-1">
              Actively verified schemes for Karnataka, Maharashtra, and All-India college students.
            </p>
          </div>

          <Link
            to="/scholarships"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-colors shrink-0"
          >
            <span>View all opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      </div>
    </section>
  );
};

