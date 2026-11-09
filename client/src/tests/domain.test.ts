import { describe, it, expect } from 'vitest';
import { evaluateRule, evaluateScholarship } from '../../../shared/domain/matching';
import { calculateReadiness } from '../../../shared/domain/readiness';
import { EligibilityRule, Scholarship, PreparationChecklistItem } from '../../../shared/types';

describe('Domain: Rule Matching Engine', () => {
  const baseRule: EligibilityRule = {
    id: 'rule-1',
    field: 'domicileState',
    label: 'Domicile State',
    operator: 'EQUALS',
    expectedValue: 'Karnataka',
    explanation: 'Must reside in Karnataka.',
    sourceReferenceId: 'src-1',
  };

  it('Missing answer MUST return UNKNOWN, never PASS', () => {
    const resultUndefined = evaluateRule(baseRule, {});
    expect(resultUndefined.result).toBe('UNKNOWN');
    expect(resultUndefined.reasonCode).toBe('ANSWER_NOT_PROVIDED');

    const resultNull = evaluateRule(baseRule, { domicileState: null as any });
    expect(resultNull.result).toBe('UNKNOWN');

    const resultEmpty = evaluateRule(baseRule, { domicileState: '' });
    expect(resultEmpty.result).toBe('UNKNOWN');
  });

  it('EQUALS operator matches case-insensitively for strings', () => {
    const passResult = evaluateRule(baseRule, { domicileState: 'karnataka' });
    expect(passResult.result).toBe('PASS');

    const failResult = evaluateRule(baseRule, { domicileState: 'Maharashtra' });
    expect(failResult.result).toBe('FAIL');
  });

  it('IN operator verifies if answer is in accepted list', () => {
    const inRule: EligibilityRule = {
      id: 'rule-in',
      field: 'studyLevel',
      label: 'Study Level',
      operator: 'IN',
      expectedValue: ['UNDERGRADUATE', 'DIPLOMA'],
      explanation: 'Must be in UG or Diploma.',
      sourceReferenceId: 'src-1',
    };

    expect(evaluateRule(inRule, { studyLevel: 'UNDERGRADUATE' }).result).toBe('PASS');
    expect(evaluateRule(inRule, { studyLevel: 'DIPLOMA' }).result).toBe('PASS');
    expect(evaluateRule(inRule, { studyLevel: 'POSTGRADUATE' }).result).toBe('FAIL');
  });

  it('LESS_THAN_OR_EQUAL operator evaluates ceiling thresholds', () => {
    const incomeRule: EligibilityRule = {
      id: 'rule-income',
      field: 'householdAnnualIncome',
      label: 'Income ceiling',
      operator: 'LESS_THAN_OR_EQUAL',
      expectedValue: 250000,
      explanation: 'Under 2.5L',
      sourceReferenceId: 'src-1',
    };

    expect(evaluateRule(incomeRule, { householdAnnualIncome: 200000 }).result).toBe('PASS');
    expect(evaluateRule(incomeRule, { householdAnnualIncome: 250000 }).result).toBe('PASS');
    expect(evaluateRule(incomeRule, { householdAnnualIncome: 300000 }).result).toBe('FAIL');
  });

  it('GREATER_THAN_OR_EQUAL operator evaluates minimum score benchmarks', () => {
    const scoreRule: EligibilityRule = {
      id: 'rule-score',
      field: 'academicScorePercentage',
      label: 'Score benchmark',
      operator: 'GREATER_THAN_OR_EQUAL',
      expectedValue: 80,
      explanation: 'Min 80%',
      sourceReferenceId: 'src-1',
    };

    expect(evaluateRule(scoreRule, { academicScorePercentage: 85 }).result).toBe('PASS');
    expect(evaluateRule(scoreRule, { academicScorePercentage: 80 }).result).toBe('PASS');
    expect(evaluateRule(scoreRule, { academicScorePercentage: 79.5 }).result).toBe('FAIL');
  });

  it('Overall evaluation returns POTENTIAL_MATCH, NEEDS_MORE_INFORMATION, or DOES_NOT_MATCH', () => {
    const sampleScholarship: Scholarship = {
      id: 'sch-1',
      slug: 'sch-1',
      version: 1,
      name: 'Sample Scholarship',
      provider: { name: 'Dept', type: 'Gov', officialWebsite: 'https://gov.in' },
      studyLevel: 'UNDERGRADUATE',
      domicileStates: ['Karnataka'],
      shortSummary: 'Summary',
      detailedDescription: 'Details',
      benefit: { type: 'FIXED', headline: '10k' },
      availability: 'OPEN',
      deadlineType: 'DATE_ONLY',
      officialPortalUrl: 'https://gov.in',
      rules: [
        baseRule,
        {
          id: 'rule-2',
          field: 'academicScorePercentage',
          label: 'Score',
          operator: 'GREATER_THAN_OR_EQUAL',
          expectedValue: 80,
          explanation: 'Min 80%',
          sourceReferenceId: 'src-1',
        },
      ],
      documents: [],
      steps: [],
      sources: [],
    };

    // 1. When all rules pass => POTENTIAL_MATCH
    const allPass = evaluateScholarship(sampleScholarship, {
      domicileState: 'Karnataka',
      academicScorePercentage: 85,
    });
    expect(allPass.matchStatus).toBe('POTENTIAL_MATCH');

    // 2. When one rule is missing and none fail => NEEDS_MORE_INFORMATION
    const missingOne = evaluateScholarship(sampleScholarship, {
      domicileState: 'Karnataka',
    });
    expect(missingOne.matchStatus).toBe('NEEDS_MORE_INFORMATION');

    // 3. When any rule fails => DOES_NOT_MATCH_CHECKED_CRITERIA (even if another is unknown)
    const oneFail = evaluateScholarship(sampleScholarship, {
      domicileState: 'Maharashtra',
    });
    expect(oneFail.matchStatus).toBe('DOES_NOT_MATCH_CHECKED_CRITERIA');
  });
});

describe('Domain: Readiness Calculation', () => {
  it('Calculates readiness as percentage of required applicable items marked ready', () => {
    const items: PreparationChecklistItem[] = [
      {
        id: '1',
        title: 'Req 1',
        description: 'd',
        requirementType: 'REQUIRED',
        applicability: 'APPLICABLE',
        status: 'READY',
      },
      {
        id: '2',
        title: 'Req 2',
        description: 'd',
        requirementType: 'REQUIRED',
        applicability: 'APPLICABLE',
        status: 'NOT_STARTED',
      },
      {
        id: '3',
        title: 'Optional 1',
        description: 'd',
        requirementType: 'OPTIONAL',
        applicability: 'APPLICABLE',
        status: 'READY', // should not affect percentage
      },
    ];

    const score = calculateReadiness(items);
    expect(score.percentage).toBe(50);
    expect(score.requiredCompleted).toBe(1);
    expect(score.requiredTotal).toBe(2);
    expect(score.optionalTotal).toBe(1);
    expect(score.optionalCompleted).toBe(1);
    expect(score.isFullyReady).toBe(false);
    expect(score.label).toBe('1 of 2 required tasks ready');
  });

  it('Unknown applicability blocks fully-ready label even if all current are ready', () => {
    const items: PreparationChecklistItem[] = [
      {
        id: '1',
        title: 'Req 1',
        description: 'd',
        requirementType: 'REQUIRED',
        applicability: 'APPLICABLE',
        status: 'READY',
      },
      {
        id: '2',
        title: 'Req 2',
        description: 'd',
        requirementType: 'REQUIRED',
        applicability: 'UNKNOWN',
        status: 'NOT_STARTED',
      },
    ];

    const score = calculateReadiness(items);
    expect(score.percentage).toBe(100);
    expect(score.isFullyReady).toBe(false);
    expect(score.hasUnknownApplicability).toBe(true);
  });

  it('Zero applicable required tasks produces Not calculated', () => {
    const items: PreparationChecklistItem[] = [
      {
        id: '1',
        title: 'Opt',
        description: 'd',
        requirementType: 'OPTIONAL',
        applicability: 'APPLICABLE',
        status: 'READY',
      },
    ];

    const score = calculateReadiness(items);
    expect(score.requiredTotal).toBe(0);
    expect(score.isFullyReady).toBe(false);
    expect(score.label).toContain('Not calculated');
  });
});
