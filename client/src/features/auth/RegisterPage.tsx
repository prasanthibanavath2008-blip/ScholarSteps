import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { STATE_SELECT_OPTIONS } from '@shared/constants/states';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [domicileState, setDomicileState] = useState('Karnataka');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        domicileState,
      });

      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Registration failed. Please check your details.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-canvas min-h-[calc(100vh-140px)] flex items-center justify-center animate-page-entry">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-panel border border-border shadow-raised p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-page-title text-2xl text-ink">Create student account</h1>
            <p className="text-sm text-ink-secondary">
              Save opportunities, create cloud preparation checklists, and track milestones with your own profile.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-danger-tint border border-danger/30 rounded-control text-xs text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Full Name"
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              helperText="This name will appear on your personalized dashboard and checklists."
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Select
              label="State of Domicile"
              options={STATE_SELECT_OPTIONS}
              value={domicileState}
              onChange={(e) => setDomicileState(e.target.value)}
              helperText="Determines state-specific scheme eligibility."
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="For voluntary application deadline notifications."
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              required
              minLength={8}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register Account
            </Button>
          </form>

          <div className="p-3 rounded-control bg-canvas border border-border text-xs text-ink-muted flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              By registering, you agree that ScholarSteps is an independent guidance platform and does
              not disburse government funds directly.
            </span>
          </div>

          <div className="pt-4 border-t border-border text-center text-xs text-ink-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
