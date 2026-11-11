import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { STATE_SELECT_OPTIONS } from '@shared/constants/states';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { User, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile, getProfile } = useAuth();

  // Personal information fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Academic parameters
  const [domicileState, setDomicileState] = useState('Karnataka');
  const [studyLevel, setStudyLevel] = useState('UNDERGRADUATE');
  const [courseGroup, setCourseGroup] = useState('ENGINEERING');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [academicScore, setAcademicScore] = useState('85');
  const [familyIncomeBracket, setFamilyIncomeBracket] = useState('BELOW_2_LAKH');

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    setDisplayName(user?.displayName || profile.displayName || '');
    setEmail(user?.email || profile.email || '');
    setPhone(user?.phone || profile.phone || '');
    setDomicileState(user?.domicileState || profile.domicileState || 'Karnataka');
    setStudyLevel(profile.studyLevel || 'UNDERGRADUATE');
    setCourseGroup(profile.courseGroup || 'ENGINEERING');
    setAcademicYear(profile.academicYear || '2026-27');
    setAcademicScore(profile.academicScore || '85');
    setFamilyIncomeBracket(profile.familyIncomeBracket || 'BELOW_2_LAKH');
  }, [user, getProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      domicileState,
      studyLevel,
      courseGroup,
      academicYear,
      academicScore,
      familyIncomeBracket,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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

  const incomeOptions = [
    { value: 'BELOW_1_LAKH', label: 'Less than ₹1.00 Lakh / year' },
    { value: 'BELOW_2_LAKH', label: '₹1.00 - ₹2.50 Lakh / year' },
    { value: 'BELOW_5_LAKH', label: '₹2.50 - ₹5.00 Lakh / year' },
    { value: 'BELOW_8_LAKH', label: '₹5.00 - ₹8.00 Lakh / year' },
    { value: 'ABOVE_8_LAKH', label: 'Above ₹8.00 Lakh / year' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Student Profile</span>
            </div>
            <h1 className="font-page-title text-2xl text-ink">Personal Information & Domicile</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              Ensure your exact details and academic parameters are accurate across your workspace.
            </p>
          </div>

          {saved && (
            <span className="text-xs text-success font-semibold flex items-center gap-1 bg-success-tint px-3 py-1.5 rounded-full border border-success/30 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Information Saved</span>
            </span>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded-card bg-canvas-warm border border-border flex items-start gap-3 text-xs text-ink-secondary">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span>You are editing in browser guest mode. </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>{' '}
              or{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                create an account
              </Link>{' '}
              to sync your profile across devices.
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Personal Identity */}
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-card-title text-lg text-ink">Personal Identity</h2>
            <p className="text-xs text-ink-secondary">
              Your name and contact information are used to personalize your preparation workspace.
            </p>

            <div className="space-y-4 pt-2">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="Enter your full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                helperText="Displayed on your dashboard greeting and export checklists."
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Used for optional deadline reminder notifications."
              />
            </div>
          </div>

          {/* Card 2: Academic Profile & Domicile */}
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-card-title text-lg text-ink">Academic Profile & Domicile</h2>
            <p className="text-xs text-ink-secondary">
              These parameters evaluate state and merit thresholds for scholarships across India.
            </p>

            <div className="space-y-4 pt-2">
              <Select
                label="State of Domicile"
                options={STATE_SELECT_OPTIONS}
                value={domicileState}
                onChange={(e) => setDomicileState(e.target.value)}
                helperText="State where you hold permanent domicile or revenue nativity certification."
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

              <Select
                label="Annual Family Income Bracket"
                options={incomeOptions}
                value={familyIncomeBracket}
                onChange={(e) => setFamilyIncomeBracket(e.target.value)}
                helperText="Official Tehsildar income certificate ceiling tier."
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
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Zero sensitive government identifiers (No Aadhaar numbers stored)</span>
            </div>

            <Button type="submit" variant="primary">
              Save All Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
