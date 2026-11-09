import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-canvas min-h-[calc(100vh-140px)] flex items-center justify-center animate-page-entry">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-panel border border-border shadow-raised p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h1 className="font-card-title text-2xl text-ink">Reset password</h1>
            <p className="text-sm text-ink-secondary">
              Enter your account email to receive a password recovery link.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-success-tint/60 border border-success/30 rounded-control space-y-2">
              <div className="flex items-center gap-2 text-success font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instructions Dispatched</span>
              </div>
              <p className="text-xs text-ink-secondary">
                If an account exists for {email}, you will receive a secure password reset link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button type="submit" variant="primary" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-primary font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

