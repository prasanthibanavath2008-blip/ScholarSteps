import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="py-16 bg-canvas min-h-[calc(100vh-140px)] flex items-center justify-center animate-page-entry">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-panel border border-border shadow-raised p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-success-tint text-success flex items-center justify-center mx-auto border border-success/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="font-card-title text-2xl text-ink">Email verified</h1>
            <p className="text-sm text-ink-secondary">
              Your email address has been successfully verified. Your account is active.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/dashboard">
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

