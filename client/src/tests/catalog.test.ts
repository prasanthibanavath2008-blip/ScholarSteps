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

  it('filters scholarships by state for both North and South India', () => {
    // South India tests (Karnataka, Tamil Nadu, Telangana)
    const karnataka = filterScholarships({ state: 'Karnataka' });
    expect(karnataka.some((s) => s.slug === 'ssp-karnataka-postmatric')).toBe(true);
    expect(karnataka.some((s) => s.domicileStates.includes('All India'))).toBe(true);

    const tamilNadu = filterScholarships({ state: 'Tamil Nadu' });
    expect(tamilNadu.some((s) => s.slug === 'tn-postmatric-scholarship')).toBe(true);
    expect(tamilNadu.some((s) => s.domicileStates.includes('All India'))).toBe(true);

    const telangana = filterScholarships({ state: 'Telangana' });
    expect(telangana.some((s) => s.slug === 'telangana-epass-rtf')).toBe(true);

    // North & Central/West India tests (Uttar Pradesh, Delhi, Maharashtra)
    const uttarPradesh = filterScholarships({ state: 'Uttar Pradesh' });
    expect(uttarPradesh.some((s) => s.slug === 'up-postmatric-fee-reimbursement')).toBe(true);
    expect(uttarPradesh.some((s) => s.domicileStates.includes('All India'))).toBe(true);

    const delhi = filterScholarships({ state: 'Delhi' });
    expect(delhi.some((s) => s.slug === 'delhi-higher-education-fee-waiver')).toBe(true);

    const maharashtra = filterScholarships({ state: 'Maharashtra' });
    expect(maharashtra.some((s) => s.slug === 'mahadbt-rajarshi-chhatrapati-shahu-maharaj')).toBe(true);
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

