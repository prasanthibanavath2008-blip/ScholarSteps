import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterScholarships, CatalogFilterOptions } from '../../lib/catalog';
import { CATALOG_STATE_FILTER_OPTIONS } from '@shared/constants/states';
import { ScholarshipCard } from '../../components/scholarships/ScholarshipCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Search, SlidersHorizontal, RotateCcw, X, Info } from 'lucide-react';

export const ScholarshipExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const searchQuery = searchParams.get('q') || '';
  const selectedState = searchParams.get('state') || 'ALL';
  const selectedLevel = searchParams.get('level') || 'ALL';
  const selectedAvailability = searchParams.get('avail') || 'ALL';
  const sortBy = (searchParams.get('sort') as CatalogFilterOptions['sortBy']) || 'RECENTLY_REVIEWED';

  // Mobile bottom sheet state
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Local search input for responsive typing
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounce search update to URL parameters
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('q', searchInput.trim());
          } else {
            next.delete('q');
          }
          return next;
        },
        { replace: true }
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'ALL') {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
    setFilterSheetOpen(false);
  };

  // Compute filtered scholarships
  const filteredScholarships = useMemo(() => {
    return filterScholarships({
      searchQuery,
      state: selectedState,
      studyLevel: selectedLevel,
      availability: selectedAvailability,
      sortBy,
    });
  }, [searchQuery, selectedState, selectedLevel, selectedAvailability, sortBy]);

  // Active filters count
  const activeFiltersCount =
    (selectedState !== 'ALL' ? 1 : 0) +
    (selectedLevel !== 'ALL' ? 1 : 0) +
    (selectedAvailability !== 'ALL' ? 1 : 0);

  const stateOptions = CATALOG_STATE_FILTER_OPTIONS;

  const levelOptions = [
    { value: 'ALL', label: 'All Study Levels' },
    { value: 'UNDERGRADUATE', label: 'Undergraduate (UG)' },
    { value: 'DIPLOMA', label: 'Diploma / Technical' },
    { value: 'POSTGRADUATE', label: 'Postgraduate (PG)' },
  ];

  const availabilityOptions = [
    { value: 'ALL', label: 'All Cycles' },
    { value: 'OPEN', label: 'Open Now' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'CLOSED', label: 'Cycle Closed' },
  ];

  const sortOptions = [
    { value: 'RECENTLY_REVIEWED', label: 'Recently reviewed' },
    { value: 'DEADLINE_SOONEST', label: 'Closing soonest' },
    { value: 'ALPHABETICAL', label: 'Alphabetical (A-Z)' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Purpose */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Opportunity Catalog</span>
          </div>
          <h1 className="font-page-title text-ink">Explore opportunities</h1>
          <p className="font-large-body text-ink-secondary mt-1 max-w-2xl">
            A focused catalog with verified official sources, application steps, and clear deadline
            uncertainty labels.
          </p>
        </div>

        {/* Search bar & Mobile toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <Input
              label="Search opportunities"
              id="catalog-search"
              placeholder="Search by scholarship name, state department, or ministry..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto pt-1 sm:pt-6">
            {/* Mobile filter button */}
            <Button
              variant="secondary"
              className="lg:hidden flex items-center gap-2"
              onClick={() => setFilterSheetOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6 text-xs">
            <span className="text-ink-muted font-medium">Active filters:</span>
            {selectedState !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-ink font-medium">
                <span>State: {selectedState}</span>
                <button
                  onClick={() => updateParam('state', 'ALL')}
                  className="hover:text-danger"
                  aria-label="Remove state filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedLevel !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-ink font-medium">
                <span>Level: {selectedLevel}</span>
                <button
                  onClick={() => updateParam('level', 'ALL')}
                  className="hover:text-danger"
                  aria-label="Remove level filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedAvailability !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-ink font-medium">
                <span>Cycle: {selectedAvailability}</span>
                <button
                  onClick={() => updateParam('avail', 'ALL')}
                  className="hover:text-danger"
                  aria-label="Remove cycle filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-primary hover:underline font-semibold ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* 12-Column Grid: 3-column Filter Rail on Desktop, 9-column Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Rail (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-surface rounded-card border border-border p-6 shadow-card space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-card-title text-base text-ink flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Filter Catalog</span>
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-ink-muted hover:text-danger flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <Select
              label="State / Domicile"
              options={stateOptions}
              value={selectedState}
              onChange={(e) => updateParam('state', e.target.value)}
            />

            <Select
              label="Study Level"
              options={levelOptions}
              value={selectedLevel}
              onChange={(e) => updateParam('level', e.target.value)}
            />

            <Select
              label="Availability Cycle"
              options={availabilityOptions}
              value={selectedAvailability}
              onChange={(e) => updateParam('avail', e.target.value)}
            />

            <div className="pt-2 border-t border-border/60 text-xs text-ink-muted flex items-start gap-2">
              <Info className="w-4 h-4 text-ink-muted shrink-0 mt-0.5" />
              <span>
                Filters only search public criteria. Use the Guided Match Finder for personalized checks.
              </span>
            </div>
          </aside>

          {/* Results Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Toolbar: Count & Sort */}
            <div className="bg-surface rounded-control border border-border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
              <span className="font-medium text-ink">
                Showing{' '}
                <strong className="text-primary font-bold">{filteredScholarships.length}</strong>{' '}
                {filteredScholarships.length === 1 ? 'opportunity' : 'opportunities'}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-ink-muted whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="h-9 rounded-md bg-canvas border border-border px-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scholarships Grid */}
            {filteredScholarships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No opportunities match these filters"
                description="Try loosening your search terms or clearing state and study level constraints to view all published schemes."
                actionLabel="Clear all filters"
                onAction={handleClearFilters}
              />
            )}
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <BottomSheet
          isOpen={filterSheetOpen}
          onClose={() => setFilterSheetOpen(false)}
          title="Filter Opportunities"
          footer={
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleClearFilters}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setFilterSheetOpen(false)}
              >
                Show Results
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Select
              label="State / Domicile"
              options={stateOptions}
              value={selectedState}
              onChange={(e) => updateParam('state', e.target.value)}
            />

            <Select
              label="Study Level"
              options={levelOptions}
              value={selectedLevel}
              onChange={(e) => updateParam('level', e.target.value)}
            />

            <Select
              label="Availability Cycle"
              options={availabilityOptions}
              value={selectedAvailability}
              onChange={(e) => updateParam('avail', e.target.value)}
            />
          </div>
        </BottomSheet>
      </div>
    </div>
  );
};

