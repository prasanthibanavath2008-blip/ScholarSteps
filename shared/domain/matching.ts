import {
  EligibilityRule,
  MatchEvaluation,
  MatchStatus,
  QuestionnaireAnswers,
  RuleEvaluation,
  RuleEvaluationResult,
  Scholarship,
} from '../types';

export const OFFICIAL_DISCLAIMER =
  'This is not an official eligibility decision. It only checks self-reported answers against published criteria. Requirements must be confirmed on the official portal.';

/**
 * Pure function to evaluate a single rule against user answers.
 * Rule operators: EQUALS, IN, NOT_IN, LESS_THAN_OR_EQUAL, GREATER_THAN_OR_EQUAL, BETWEEN, BOOLEAN_IS
 * Strict rule: If answer is not provided, returns UNKNOWN. Never PASS.
 */
export function evaluateRule(
  rule: EligibilityRule,
  answers: QuestionnaireAnswers
): RuleEvaluation {
  const answer = answers[rule.field];

  if (answer === undefined || answer === null || answer === '') {
    return {
      ruleId: rule.id,
      field: rule.field,
      result: 'UNKNOWN',
      reasonCode: 'ANSWER_NOT_PROVIDED',
      explanation: `Information needed: ${rule.label}. (Answer not provided)`,
      sourceReferenceId: rule.sourceReferenceId,
    };
  }

  let result: RuleEvaluationResult = 'UNKNOWN';
  let reasonCode: 'MATCH' | 'MISMATCH' | 'ANSWER_NOT_PROVIDED' | 'UNSUPPORTED_OPERATOR' = 'MATCH';
  let explanation = '';

  switch (rule.operator) {
    case 'EQUALS': {
      const match =
        (rule.field === 'domicileState' &&
          typeof rule.expectedValue === 'string' &&
          rule.expectedValue.toLowerCase() === 'all india') ||
        (typeof answer === 'string' && typeof rule.expectedValue === 'string'
          ? answer.trim().toLowerCase() === rule.expectedValue.trim().toLowerCase()
          : answer === rule.expectedValue);

      result = match ? 'PASS' : 'FAIL';
      reasonCode = match ? 'MATCH' : 'MISMATCH';
      explanation = match
        ? `Matches requirement: ${rule.label} is ${rule.expectedValue}.`
        : `Does not match: requires ${rule.expectedValue}, but reported as ${answer}.`;
      break;
    }

    case 'IN': {
      const expectedList: any[] = Array.isArray(rule.expectedValue)
        ? rule.expectedValue
        : [rule.expectedValue];

      const match =
        (rule.field === 'domicileState' &&
          expectedList.some((item) => typeof item === 'string' && item.toLowerCase() === 'all india')) ||
        expectedList.some((item) =>
          typeof item === 'string' && typeof answer === 'string'
            ? item.toLowerCase() === answer.toLowerCase()
            : item === answer
        );

      result = match ? 'PASS' : 'FAIL';
      reasonCode = match ? 'MATCH' : 'MISMATCH';
      explanation = match
        ? `Matches category requirement: ${rule.label}.`
        : `Reported ${answer} is not within the accepted options.`;
      break;
    }

    case 'NOT_IN': {
      const excludedList: any[] = Array.isArray(rule.expectedValue)
        ? rule.expectedValue
        : [rule.expectedValue];

      const isExcluded = excludedList.some((item) =>
        typeof item === 'string' && typeof answer === 'string'
          ? item.toLowerCase() === answer.toLowerCase()
          : item === answer
      );

      result = !isExcluded ? 'PASS' : 'FAIL';
      reasonCode = !isExcluded ? 'MATCH' : 'MISMATCH';
      explanation = !isExcluded
        ? `Meets condition: not in excluded criteria.`
        : `Excluded by criterion: ${answer}.`;
      break;
    }

    case 'LESS_THAN_OR_EQUAL': {
      const numAnswer = Number(answer);
      const threshold = Number(rule.expectedValue);

      if (isNaN(numAnswer) || isNaN(threshold)) {
        result = 'UNKNOWN';
        reasonCode = 'UNSUPPORTED_OPERATOR';
        explanation = 'Could not compare values numerically.';
      } else {
        const match = numAnswer <= threshold;
        result = match ? 'PASS' : 'FAIL';
        reasonCode = match ? 'MATCH' : 'MISMATCH';
        explanation = match
          ? `Meets ceiling: reported ${numAnswer} is within limit of ${threshold}.`
          : `Exceeds upper limit: reported ${numAnswer} exceeds ${threshold}.`;
      }
      break;
    }

    case 'GREATER_THAN_OR_EQUAL': {
      const numAnswer = Number(answer);
      const threshold = Number(rule.expectedValue);

      if (isNaN(numAnswer) || isNaN(threshold)) {
        result = 'UNKNOWN';
        reasonCode = 'UNSUPPORTED_OPERATOR';
        explanation = 'Could not compare values numerically.';
      } else {
        const match = numAnswer >= threshold;
        result = match ? 'PASS' : 'FAIL';
        reasonCode = match ? 'MATCH' : 'MISMATCH';
        explanation = match
          ? `Meets minimum benchmark: reported ${numAnswer}% meets minimum ${threshold}%.`
          : `Below minimum threshold: reported ${numAnswer}% is below ${threshold}%.`;
      }
      break;
    }

    case 'BETWEEN': {
      const numAnswer = Number(answer);
      if (Array.isArray(rule.expectedValue) && rule.expectedValue.length === 2) {
        const [min, max] = rule.expectedValue.map(Number);
        const match = numAnswer >= min && numAnswer <= max;
        result = match ? 'PASS' : 'FAIL';
        reasonCode = match ? 'MATCH' : 'MISMATCH';
        explanation = match
          ? `Within range: ${numAnswer} is between ${min} and ${max}.`
          : `Outside range: ${numAnswer} is not between ${min} and ${max}.`;
      } else {
        result = 'UNKNOWN';
        reasonCode = 'UNSUPPORTED_OPERATOR';
        explanation = 'Range bounds were invalid.';
      }
      break;
    }

    case 'BOOLEAN_IS': {
      const boolAnswer = Boolean(answer);
      const expectedBool = Boolean(rule.expectedValue);
      const match = boolAnswer === expectedBool;
      result = match ? 'PASS' : 'FAIL';
      reasonCode = match ? 'MATCH' : 'MISMATCH';
      explanation = match
        ? `Status matches: ${rule.label}.`
        : `Requirement not satisfied for ${rule.label}.`;
      break;
    }

    default:
      result = 'UNKNOWN';
      reasonCode = 'UNSUPPORTED_OPERATOR';
      explanation = `Operator ${rule.operator} is not recognized.`;
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    result,
    reasonCode,
    explanation: rule.explanation || explanation,
    sourceReferenceId: rule.sourceReferenceId,
  };
}

/**
 * Pure function to evaluate all rules for a given scholarship.
 * Overall result:
 * - Any FAIL => DOES_NOT_MATCH_CHECKED_CRITERIA
 * - No FAIL, at least one UNKNOWN => NEEDS_MORE_INFORMATION
 * - All checked rules PASS => POTENTIAL_MATCH
 */
export function evaluateScholarship(
  scholarship: Scholarship,
  answers: QuestionnaireAnswers
): MatchEvaluation {
  const evaluatedRules = scholarship.rules.map((rule) => evaluateRule(rule, answers));

  let matchStatus: MatchStatus;
  const hasFail = evaluatedRules.some((r) => r.result === 'FAIL');
  const hasUnknown = evaluatedRules.some((r) => r.result === 'UNKNOWN');

  if (hasFail) {
    matchStatus = 'DOES_NOT_MATCH_CHECKED_CRITERIA';
  } else if (hasUnknown || evaluatedRules.length === 0) {
    matchStatus = 'NEEDS_MORE_INFORMATION';
  } else {
    matchStatus = 'POTENTIAL_MATCH';
  }

  return {
    scholarshipId: scholarship.id,
    scholarshipVersion: scholarship.version,
    matchStatus,
    availabilityStatus: scholarship.availability,
    rules: evaluatedRules,
    evaluatedAt: new Date().toISOString(),
    disclaimer: OFFICIAL_DISCLAIMER,
  };
}

