export type BenefitType = 'FIXED' | 'RANGE' | 'REIMBURSEMENT' | 'VARIABLE' | 'NOT_SPECIFIED';

export type FreshnessState =
  | 'REVIEWED'
  | 'REVIEW_DUE'
  | 'SOURCE_CHANGED'
  | 'LINK_UNAVAILABLE'
  | 'UNVERIFIED';

export type AvailabilityStatus =
  | 'OPEN'
  | 'UPCOMING'
  | 'CLOSED'
  | 'ROLLING'
  | 'NOT_ANNOUNCED'
  | 'UNKNOWN';

export type DeadlinePrecision = 'DATE_ONLY' | 'DATETIME' | 'ROLLING' | 'UNKNOWN' | 'NOT_ANNOUNCED';

export type RuleOperator =
  | 'EQUALS'
  | 'IN'
  | 'NOT_IN'
  | 'LESS_THAN_OR_EQUAL'
  | 'GREATER_THAN_OR_EQUAL'
  | 'BETWEEN'
  | 'BOOLEAN_IS';

export type RuleEvaluationResult = 'PASS' | 'FAIL' | 'UNKNOWN';

export type MatchStatus =
  | 'POTENTIAL_MATCH'
  | 'NEEDS_MORE_INFORMATION'
  | 'DOES_NOT_MATCH_CHECKED_CRITERIA';

export type ApplicationStage =
  | 'EXPLORING'
  | 'PREPARING'
  | 'READY_TO_APPLY'
  | 'SUBMITTED'
  | 'FOLLOW_UP'
  | 'AWARDED'
  | 'NOT_SELECTED'
  | 'WITHDRAWN';

export type ChecklistItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY';

export type RequirementType = 'REQUIRED' | 'OPTIONAL' | 'CONDITIONAL';

export type Applicability = 'APPLICABLE' | 'NOT_APPLICABLE' | 'UNKNOWN';

export interface SourceReference {
  id: string;
  url: string;
  organization: string;
  sourceType: 'GOVERNMENT_PORTAL' | 'INSTITUTION' | 'FOUNDATION' | 'TRUST';
  reviewedAt: string; // ISO-8601
  freshness: FreshnessState;
  excerpt: string;
  notes?: string;
}

export interface EligibilityRule {
  id: string;
  field: string;
  label: string;
  operator: RuleOperator;
  expectedValue: any;
  explanation: string;
  sourceReferenceId: string;
}

export interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  requirementType: RequirementType;
  condition?: string;
  instructionUrl?: string;
  sourceReferenceId: string;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  officialPortalUrl?: string;
}

export interface ScholarshipBenefit {
  type: BenefitType;
  headline: string;
  details?: string;
  amountMin?: number;
  amountMax?: number;
  currency?: string;
}

export interface Scholarship {
  id: string;
  slug: string;
  version: number;
  name: string;
  provider: {
    name: string;
    type: string;
    officialWebsite: string;
  };
  studyLevel: 'PRE_UNIVERSITY' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'DIPLOMA' | 'DOCTORAL' | 'ALL';
  courseGroups?: string[];
  domicileStates: string[];
  shortSummary: string;
  detailedDescription: string;
  benefit: ScholarshipBenefit;
  availability: AvailabilityStatus;
  deadlineType: DeadlinePrecision;
  deadlineDate?: string; // ISO-8601 or date
  deadlineNotes?: string;
  officialPortalUrl: string;
  rules: EligibilityRule[];
  documents: DocumentRequirement[];
  steps: ApplicationStep[];
  sources: SourceReference[];
  isSynthetic?: boolean; // Label synthetic fixtures visibly
}

export interface QuestionnaireAnswers {
  domicileState?: string;
  studyLevel?: string;
  courseGroup?: string;
  academicYear?: string;
  academicScorePercentage?: number;
  householdAnnualIncome?: number;
  genderCategory?: string;
  socialCategory?: string;
  disabilityStatus?: boolean;
  [key: string]: any;
}

export interface RuleEvaluation {
  ruleId: string;
  field: string;
  result: RuleEvaluationResult;
  reasonCode: 'MATCH' | 'MISMATCH' | 'ANSWER_NOT_PROVIDED' | 'UNSUPPORTED_OPERATOR';
  explanation: string;
  sourceReferenceId?: string;
}

export interface MatchEvaluation {
  scholarshipId: string;
  scholarshipVersion: number;
  matchStatus: MatchStatus;
  availabilityStatus: AvailabilityStatus;
  rules: RuleEvaluation[];
  evaluatedAt: string; // ISO-8601
  disclaimer: string;
}

export interface PreparationChecklistItem {
  id: string;
  sourceRequirementId?: string;
  title: string;
  description: string;
  requirementType: RequirementType;
  applicability: Applicability;
  status: ChecklistItemStatus;
  instructionLink?: string;
  note?: string;
  markedReadyAt?: string;
}

export interface PreparationPlan {
  id: string;
  scholarshipId: string;
  scholarshipSlug: string;
  scholarshipName: string;
  providerName: string;
  versionId: number;
  cycleLabel: string;
  stage?: ApplicationStage;
  createdAt: string;
  updatedAt: string;
  officialPortalUrl: string;
  items: PreparationChecklistItem[];
  userNotes?: string;
  sourceVersionCheckDate: string;
  hasOutdatedSource?: boolean;
}

export interface ReadinessScore {
  percentage: number;
  requiredTotal: number;
  requiredCompleted: number;
  optionalTotal: number;
  optionalCompleted: number;
  hasUnknownApplicability: boolean;
  isFullyReady: boolean;
  label: string; // e.g. "3 of 5 required tasks ready"
}

