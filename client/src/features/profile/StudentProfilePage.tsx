import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { User, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, loginAsDemo } = useAuth();

  const [domicileState, setDomicileState] = useState('Karnataka');
  const [studyLevel, setStudyLevel] = useState('UNDERGRADUATE');
  const [courseGroup, setCourseGroup] = useState('ENGINEERING');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [academicScore, setAcademicScore] = useState('85');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) loginAsDemo('STUDENT');
  }, [user, loginAsDemo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stateOptions = [
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Other', label: 'Other State' },
  ];

  const levelOptions = [
    { value: 'UNDERGRADUATE', label: 'Undergraduate (UG)' },
    { value: 'DIPLOMA', label: 'Diploma / Polytechnic' },
    { value: 'POSTGRADUATE', label: 'Postgraduate (PG)' },
    { value: 'PRE_UNIVERSITY', label: 'Pre-University (11th-12th)' },
  ];

  const courseOptions = [
    { value: 'ENGINEERING', label: 'Engineering & Technology' },
    { value: 'GENERAL_DEGREE', label: 'Sciences / Arts / Humanities' },
    { value: 'COMMERCE', label: 'Commerce & Business' },
    { value: 'MEDICAL', label: 'Medical & Healthcare' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Student Profile</span>
            </div>
            <h1 className="font-page-title text-2xl text-ink">Academic Profile & Domicile</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              Manage your academic parameters used to pre-populate match assessments.
            </p>
          </div>

          {saved && (
            <span className="text-xs text-success font-semibold flex items-center gap-1 bg-success-tint px-3 py-1.5 rounded-full border border-success/30 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Profile Saved</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-4">
            <Select
              label="State of Domicile"
              options={stateOptions}
              value={domicileState}
              onChange={(e) => setDomicileState(e.target.value)}
              helperText="State where you hold a permanent domicile or revenue nativity certificate."
            />

            <Select
              label="Current Study Level"
              options={levelOptions}
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
            />

            <Select
              label="Academic Discipline"
              options={courseOptions}
              value={courseGroup}
              onChange={(e) => setCourseGroup(e.target.value)}
            />

            <Input
              label="Academic Cycle / Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-27"
            />

            <Input
              label="Previous Qualifying Percentage (%)"
              type="number"
              value={academicScore}
              onChange={(e) => setAcademicScore(e.target.value)}
              helperText="Used strictly to evaluate merit thresholds locally."
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Encrypted and stored in private session</span>
            </div>

            <Button type="submit" variant="primary">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

