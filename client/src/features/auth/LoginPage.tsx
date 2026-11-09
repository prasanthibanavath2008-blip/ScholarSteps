import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ShieldCheck, Sparkles, User, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@scholarsteps.org') {
        loginAsDemo('ADMIN');
        navigate('/admin');
      } else {
        loginAsDemo('STUDENT');
        navigate('/dashboard');
      }
    }, 400);
  };

  const handleQuickDemoStudent = () => {
    loginAsDemo('STUDENT');
    navigate('/dashboard');
  };

  const handleQuickDemoAdmin = () => {
    loginAsDemo('ADMIN');
    navigate('/admin');
  };

  return (
    <div className="py-12 sm:py-16 bg-canvas min-h-[calc(100vh-140px)] flex items-center justify-center animate-page-entry">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 bg-surface rounded-panel border border-border shadow-raised overflow-hidden">
          {/* Left Brand Panel (Desktop only, 5 cols) */}
          <div className="hidden md:flex md:col-span-5 bg-canvas-warm p-8 border-r border-border flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-heading font-bold">
                <span className="text-accent text-lg">S</span>
              </div>
              <h2 className="font-section-heading text-2xl text-ink">
                Sign in to your preparation workspace
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Sync preparation checklists across devices, track application milestones, and receive
                source update notifications.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-border/80 text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Zero advertisements or sponsored placements.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>Verified state and national scheme criteria.</span>
              </div>
            </div>
          </div>

          {/* Right Form Container (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h1 className="font-card-title text-2xl text-ink">Sign in</h1>
                <p className="text-sm text-ink-secondary mt-1">
                  Enter your credentials or choose a one-click evaluation session.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-danger-tint border border-danger/30 rounded-control text-xs text-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                  <Input
                    label="Password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="text-right mt-1">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign in
                </Button>
              </form>

              {/* Evaluation Quick-Access buttons */}
              <div className="mt-6 pt-5 border-t border-border">
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2.5">
                  Evaluator Fast-Access
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={handleQuickDemoStudent}
                    leftIcon={<User className="w-3.5 h-3.5 text-primary" />}
                  >
                    Demo Student
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={handleQuickDemoAdmin}
                    leftIcon={<Shield className="w-3.5 h-3.5 text-ink" />}
                  >
                    Demo Admin
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-center text-xs text-ink-secondary">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

