import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../../lib/storage';
import { QuestionnaireAnswers } from '@shared/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, ArrowRight, Sparkles, Shield, RotateCcw, Info } from 'lucide-react';

export const GuidedMatchFinderPage: React.FC = () => {
  const navigate = useNavigate();

  // Load draft answers if any
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    return StorageService.getDraftAnswers();
  });

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAnswer = (field: keyof QuestionnaireAnswers, value: any) => {
    setAnswers((prev) => {
      const updated = { ...prev, [field]: value };
      StorageService.saveDraftAnswers(updated);
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!answers.domicileState) {
        newErrors.domicileState = 'Please select your state of domicile.';
      }
      if (!answers.studyLevel) {
        newErrors.studyLevel = 'Please select your current study level.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    StorageService.clearDraftAnswers();
    setAnswers({});
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Save completed draft answers and navigate to results
      StorageService.saveDraftAnswers(answers);
      navigate('/matches');
    }
  };

  const stateOptions = [
    { value: '', label: 'Select your state' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Other State', label: 'Other State / Union Territory' },
  ];

  const levelOptions = [
    { value: '', label: 'Select study level' },
    { value: 'UNDERGRADUATE', label: 'Undergraduate (BE, BTech, BSc, BCom, BA, MBBS)' },
    { value: 'DIPLOMA', label: 'Polytechnic Diploma / Technical Certification' },
    { value: 'POSTGRADUATE', label: 'Postgraduate (ME, MTech, MSc, MCom, MA, MBA)' },
    { value: 'PRE_UNIVERSITY', label: 'Pre-University / 11th-12th / Junior College' },
  ];

  const courseGroupOptions = [
    { value: '', label: 'Select course group' },
    { value: 'ENGINEERING', label: 'Engineering & Technology' },
    { value: 'GENERAL_DEGREE', label: 'Science / Arts / Humanities' },
    { value: 'COMMERCE', label: 'Commerce & Management' },
    { value: 'MEDICAL', label: 'Medical & Healthcare' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Match Finder</span>
          </div>
          <h1 className="font-page-title text-ink">Find your next step</h1>
          <p className="font-large-body text-ink-secondary mt-1">
            Answer a few transparent questions to see which checked criteria match, and which
            information needs further review.
          </p>
        </div>

        {/* Stepper + Form layout */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Stepper Indicator (Left Rail on Desktop, Top on Mobile) */}
          <aside className="md:col-span-4 bg-surface rounded-card border border-border p-6 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Progress
              </span>
              <h2 className="font-card-title text-base text-ink">Step {currentStep} of 3</h2>
            </div>

            <div className="space-y-4">
              <div
                className={`flex items-start gap-3 p-3 rounded-control border transition-colors ${
                  currentStep === 1
                    ? 'bg-primary-tint/60 border-primary/30 text-primary font-semibold'
                    : currentStep > 1
                    ? 'bg-surface border-border text-ink'
                    : 'bg-surface-muted/40 border-border/60 text-ink-muted'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 1
                      ? 'bg-primary text-white'
                      : currentStep > 1
                      ? 'bg-success text-white'
                      : 'bg-border text-ink-muted'
                  }`}
                >
                  1
                </div>
                <div>
                  <span className="text-sm block">Study & Location</span>
                  <span className="text-xs text-ink-muted">Domicile, degree level</span>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 p-3 rounded-control border transition-colors ${
                  currentStep === 2
                    ? 'bg-primary-tint/60 border-primary/30 text-primary font-semibold'
                    : currentStep > 2
                    ? 'bg-success-tint/40 border-success/30 text-ink'
                    : 'bg-surface-muted/40 border-border/60 text-ink-muted'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 2
                      ? 'bg-primary text-white'
                      : currentStep > 2
                      ? 'bg-success text-white'
                      : 'bg-border text-ink-muted'
                  }`}
                >
                  2
                </div>
                <div>
                  <span className="text-sm block">Criteria & Income</span>
                  <span className="text-xs text-ink-muted">Score, family ceiling</span>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 p-3 rounded-control border transition-colors ${
                  currentStep === 3
                    ? 'bg-primary-tint/60 border-primary/30 text-primary font-semibold'
                    : 'bg-surface-muted/40 border-border/60 text-ink-muted'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 3 ? 'bg-primary text-white' : 'bg-border text-ink-muted'
                  }`}
                >
                  3
                </div>
                <div>
                  <span className="text-sm block">Review & Evaluate</span>
                  <span className="text-xs text-ink-muted">Verify answers</span>
                </div>
              </div>
            </div>

            {/* Privacy Promise note */}
            <div className="pt-4 border-t border-border/70 text-xs text-ink-muted space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Private & Local:</strong> Your answers are never stored in public URLs or
                  transmitted to remote servers. Unanswered questions remain safely marked as
                  unknown.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-ink-muted hover:text-danger flex items-center gap-1 transition-colors cursor-pointer pt-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all answers</span>
              </button>
            </div>
          </aside>

          {/* Form Container (Right Column, 8 cols) */}
          <main className="md:col-span-8 bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card">
            {/* Step 1: Study & Location */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-card-title text-xl text-ink">
                    1. Tell us about your study and domicile
                  </h2>
                  <p className="text-sm text-ink-secondary mt-1">
                    Most Indian state scholarships require permanent state domicile and accreditation.
                  </p>
                </div>

                <div className="space-y-5">
                  <Select
                    label="Domicile State"
                    options={stateOptions}
                    value={answers.domicileState || ''}
                    onChange={(e) => updateAnswer('domicileState', e.target.value)}
                    error={errors.domicileState}
                    helperText="Select the state where you hold a permanent domicile or native certificate."
                    required
                  />

                  <Select
                    label="Current / Enrolled Study Level"
                    options={levelOptions}
                    value={answers.studyLevel || ''}
                    onChange={(e) => updateAnswer('studyLevel', e.target.value)}
                    error={errors.studyLevel}
                    helperText="Select the level of higher education course you are pursuing."
                    required
                  />

                  <Select
                    label="Broad Course Discipline (Optional)"
                    options={courseGroupOptions}
                    value={answers.courseGroup || ''}
                    onChange={(e) => updateAnswer('courseGroup', e.target.value)}
                    helperText="Some schemes specifically target technical, professional, or general degree courses."
                  />
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to criteria
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Academic & Family Criteria */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-card-title text-xl text-ink">
                    2. Academic scores & family criteria
                  </h2>
                  <p className="text-sm text-ink-secondary mt-1">
                    Leave any question blank if you are unsure; unanswered items will be evaluated
                    as "Information needed", never as an automatic fail or pass.
                  </p>
                </div>

                <div className="space-y-5">
                  <Input
                    type="number"
                    label="Previous Qualifying Exam Percentage (%) (Optional)"
                    placeholder="e.g. 82.5"
                    min={0}
                    max={100}
                    step={0.1}
                    value={answers.academicScorePercentage ?? ''}
                    onChange={(e) =>
                      updateAnswer(
                        'academicScorePercentage',
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    helperText="Enter your percentage in Class 12 or previous academic year."
                  />

                  <div>
                    <Input
                      type="number"
                      label="Annual Gross Family Income (in ₹ INR) (Optional)"
                      placeholder="e.g. 240000"
                      min={0}
                      step={5000}
                      value={answers.householdAnnualIncome ?? ''}
                      onChange={(e) =>
                        updateAnswer(
                          'householdAnnualIncome',
                          e.target.value ? parseInt(e.target.value, 10) : undefined
                        )
                      }
                      helperText="Annual gross income as stated or expected on your Tahsildar / Revenue certificate."
                    />
                    {/* Sensitive Question Explanation Note (SDD Section 7.3 & 8.6) */}
                    <div className="mt-2 p-3 bg-info-tint/60 rounded-control border border-info/20 text-xs text-info flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        <strong>Why we ask this:</strong> Welfare schemes (e.g. SSP Karnataka under ₹2.5L or CSSS under ₹4.5L) mandate statutory income ceilings. We evaluate this locally without saving or sharing it.
                      </p>
                    </div>
                  </div>

                  <Select
                    label="Gender (Optional)"
                    options={[
                      { value: '', label: 'Select or skip' },
                      { value: 'Female', label: 'Female (Eligible for Pragati & girls schemes)' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Other', label: 'Other / Prefer not to say' },
                    ]}
                    value={answers.genderCategory || ''}
                    onChange={(e) => updateAnswer('genderCategory', e.target.value)}
                    helperText="Required for gender-specific opportunities like AICTE Pragati."
                  />
                </div>

                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Review answers
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review Answers before matching */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-card-title text-xl text-ink">
                    3. Review your answers
                  </h2>
                  <p className="text-sm text-ink-secondary mt-1">
                    Check your inputs before running deterministic matching. Any unprovided answer
                    will be clearly marked as unknown in your shortlist.
                  </p>
                </div>

                <div className="p-4 rounded-card bg-canvas border border-border space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-ink-secondary">Domicile State:</span>
                    <strong className="text-ink">{answers.domicileState || 'Not specified'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-ink-secondary">Study Level:</span>
                    <strong className="text-ink">{answers.studyLevel || 'Not specified'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-ink-secondary">Course Group:</span>
                    <strong className="text-ink">{answers.courseGroup || 'Any discipline'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-ink-secondary">Academic Percentage:</span>
                    <strong className="text-ink">
                      {answers.academicScorePercentage
                        ? `${answers.academicScorePercentage}%`
                        : 'Not provided (will remain unknown)'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-ink-secondary">Household Annual Income:</span>
                    <strong className="text-ink">
                      {answers.householdAnnualIncome
                        ? `₹${answers.householdAnnualIncome.toLocaleString('en-IN')}`
                        : 'Not provided (will remain unknown)'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-ink-secondary">Gender:</span>
                    <strong className="text-ink">{answers.genderCategory || 'Not specified'}</strong>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Edit details
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    rightIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Show potential matches
                  </Button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

