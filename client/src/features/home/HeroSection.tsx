import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { PreparationPreview } from './PreparationPreview';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-canvas-warm border-b border-border py-12 md:py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Copy (7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Small editorial label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>NextStep Rebels • Learn, Grow and Connect</span>
            </div>

            {/* Heading: max three desktop lines */}
            <h1 className="font-hero text-ink tracking-tight max-w-xl">
              Your next opportunity, with a clearer next step.
            </h1>

            {/* Short explanation */}
            <p className="font-large-body text-ink-secondary max-w-lg leading-relaxed">
              ScholarSteps turns complex state and central scholarship circulars into transparent
              rules, missing-information checks, and personalized document preparation checklists.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link to="/find" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Find my next step
                </Button>
              </Link>

              <Link to="/scholarships" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  leftIcon={<Compass className="w-5 h-5" />}
                >
                  Explore scholarships
                </Button>
              </Link>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 text-xs text-ink-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                No sign-up required for basic matching. Progress is saved locally in this browser.
              </span>
            </div>
          </div>

          {/* Right Column: Layered Preparation Preview (5 columns on desktop) */}
          <div className="lg:col-span-5 w-full">
            <PreparationPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

