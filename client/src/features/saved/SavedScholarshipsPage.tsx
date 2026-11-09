import React, { useState } from 'react';
import { ALL_SCHOLARSHIPS } from '../../lib/catalog';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import { Bookmark, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const SavedScholarshipsPage: React.FC = () => {
  // Show saved schemes from catalog
  const [savedList] = useState(() => ALL_SCHOLARSHIPS.slice(0, 3));

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks</span>
            </div>
            <h1 className="font-page-title text-2xl text-ink">Saved Opportunities</h1>
            <p className="font-large-body text-ink-secondary mt-1">
              Schemes bookmarked for future reference. Saving an opportunity does not mean you have applied.
            </p>
          </div>

          <Link to="/scholarships">
            <Button variant="secondary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
              Explore More
            </Button>
          </Link>
        </div>

        {savedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-card border border-border p-12 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-card-title text-ink">No saved opportunities</h3>
            <p className="text-sm text-ink-secondary">
              Click the bookmark icon on any scholarship card to save it here.
            </p>
            <Link to="/scholarships" className="inline-block pt-2">
              <Button variant="primary">Browse Catalog</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

