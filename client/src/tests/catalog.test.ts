import { describe, it, expect } from 'vitest';
import { filterScholarships, getScholarshipBySlug, ALL_SCHOLARSHIPS } from '../lib/catalog';

describe('Catalog: Search and Filtering', () => {
  it('loads verified opportunities and synthetic fixtures with proper labeling', () => {
    expect(ALL_SCHOLARSHIPS.length).toBeGreaterThanOrEqual(4);

    const synthetic = ALL_SCHOLARSHIPS.find((s) => s.isSynthetic === true);
    expect(synthetic).toBeDefined();
    expect(synthetic?.slug).toContain('synthetic');

    const verified = ALL_SCHOLARSHIPS.filter((s) => !s.isSynthetic);
    expect(verified.length).toBeGreaterThanOrEqual(3);
    verified.forEach((s) => {
      expect(s.officialPortalUrl).toMatch(/^https?:\/\//);
      expect(s.sources.length).toBeGreaterThan(0);
      expect(s.sources[0].freshness).toBe('REVIEWED');
    });
  });

  it('filters scholarships by state', () => {
    const karnatakaOnly = filterScholarships({ state: 'Karnataka' });
    expect(karnatakaOnly.length).toBeGreaterThan(0);
    karnatakaOnly.forEach((s) => {
      expect(s.domicileStates.includes('Karnataka') || s.domicileStates.includes('All India')).toBe(
        true
      );
    });
  });

  it('filters scholarships by search query', () => {
    const sspSearch = filterScholarships({ searchQuery: 'SSP' });
    expect(sspSearch.length).toBeGreaterThan(0);
    expect(sspSearch[0].slug).toBe('ssp-karnataka-postmatric');
  });

  it('retrieves scholarship by slug correctly', () => {
    const ssp = getScholarshipBySlug('ssp-karnataka-postmatric');
    expect(ssp).toBeDefined();
    expect(ssp?.provider.name).toContain('Karnataka');
  });
});

