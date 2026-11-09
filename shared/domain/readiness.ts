import { PreparationChecklistItem, ReadinessScore } from '../types';

/**
 * Pure domain function to calculate readiness score.
 * Formula:
 * Readiness = (Required applicable tasks marked ready / Required applicable tasks) * 100
 *
 * Rules:
 * - Optional tasks do not affect the score.
 * - Unknown applicability blocks a fully-ready label.
 * - Zero applicable required tasks produces "Not calculated".
 * - Readiness is NOT eligibility, submission, or selection.
 */
export function calculateReadiness(items: PreparationChecklistItem[]): ReadinessScore {
  const applicableRequired = items.filter(
    (item) => item.requirementType === 'REQUIRED' && item.applicability === 'APPLICABLE'
  );

  const hasUnknownApplicability = items.some(
    (item) => item.requirementType === 'REQUIRED' && item.applicability === 'UNKNOWN'
  );

  const optionalItems = items.filter((item) => item.requirementType === 'OPTIONAL');

  const requiredTotal = applicableRequired.length;
  const requiredCompleted = applicableRequired.filter((item) => item.status === 'READY').length;

  const optionalTotal = optionalItems.length;
  const optionalCompleted = optionalItems.filter((item) => item.status === 'READY').length;

  if (requiredTotal === 0) {
    return {
      percentage: 0,
      requiredTotal: 0,
      requiredCompleted: 0,
      optionalTotal,
      optionalCompleted,
      hasUnknownApplicability,
      isFullyReady: false,
      label: 'Not calculated (no required applicable tasks)',
    };
  }

  const percentage = Math.round((requiredCompleted / requiredTotal) * 100);
  const isFullyReady = requiredCompleted === requiredTotal && !hasUnknownApplicability;

  return {
    percentage,
    requiredTotal,
    requiredCompleted,
    optionalTotal,
    optionalCompleted,
    hasUnknownApplicability,
    isFullyReady,
    label: `${requiredCompleted} of ${requiredTotal} required tasks ready`,
  };
}

