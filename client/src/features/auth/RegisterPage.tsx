import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      loginAsDemo('STUDENT');
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="py-12 sm:py-16 bg-canvas min-h-[calc(100vh-140px)] flex items-center justify-center animate-page-entry">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-panel border border-border shadow-raised p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-page-title text-2xl text-ink">Create student account</h1>
            <p className="text-sm text-ink-secondary">
              Save opportunities, create cloud preparation checklists, and track milestones.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Arun Kumar"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

