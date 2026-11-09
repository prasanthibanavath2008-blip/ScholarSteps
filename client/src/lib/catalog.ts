import reviewedScholarships from '@fixtures/reviewed/scholarships.json';
import syntheticScholarships from '@fixtures/synthetic/sample-scholarships.json';
import { Scholarship } from '@shared/types';

export const ALL_SCHOLARSHIPS: Scholarship[] = [
  ...(reviewedScholarships as Scholarship[]),
  ...(syntheticScholarships as Scholarship[]),
];

export interface CatalogFilterOptions {
  searchQuery?: string;
  state?: string;
  studyLevel?: string;
  availability?: string;
  sortBy?: 'RECENTLY_REVIEWED' | 'DEADLINE_SOONEST' | 'ALPHABETICAL';
}

export function getScholarshipBySlug(slug: string): Scholarship | undefined {
  return ALL_SCHOLARSHIPS.find((s) => s.slug === slug || s.id === slug);
}

export function filterScholarships(options: CatalogFilterOptions): Scholarship[] {
  let list = [...ALL_SCHOLARSHIPS];

  if (options.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.provider.name.toLowerCase().includes(q) ||
        s.shortSummary.toLowerCase().includes(q)
    );
  }

  if (options.state && options.state !== 'ALL') {
    list = list.filter(
      (s) =>
        s.domicileStates.includes('All India') ||
        s.domicileStates.some((st) => st.toLowerCase() === options.state?.toLowerCase())
    );
  }

  if (options.studyLevel && options.studyLevel !== 'ALL') {
    list = list.filter((s) => s.studyLevel === 'ALL' || s.studyLevel === options.studyLevel);
  }

  if (options.availability && options.availability !== 'ALL') {
    list = list.filter((s) => s.availability === options.availability);
  }

  if (options.sortBy === 'RECENTLY_REVIEWED') {
    list.sort((a, b) => {
      const dateA = a.sources[0]?.reviewedAt || '';
      const dateB = b.sources[0]?.reviewedAt || '';
      return dateB.localeCompare(dateA);
    });
  } else if (options.sortBy === 'DEADLINE_SOONEST') {
    list.sort((a, b) => {
      if (!a.deadlineDate) return 1;
      if (!b.deadlineDate) return -1;
      return a.deadlineDate.localeCompare(b.deadlineDate);
    });
  } else if (options.sortBy === 'ALPHABETICAL') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

