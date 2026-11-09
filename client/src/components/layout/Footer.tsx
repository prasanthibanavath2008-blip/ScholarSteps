import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-heading font-bold">
                <span className="text-accent text-base">S</span>
              </div>
              <span className="font-heading font-bold text-lg text-ink">ScholarSteps</span>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-md">
              Find your opportunity. Prepare your next step. Turning reliable Indian scholarship
              guidelines into actionable preparation checklists for students.
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span>Theme: Learn, Grow and Connect</span>
              <span>•</span>
              <span>Team: NextStep Rebels</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-label text-ink text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link to="/scholarships" className="hover:text-primary transition-colors">
                  Scholarship Explorer
                </Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-primary transition-colors">
                  Guided Match Finder
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-primary transition-colors">
                  Preparation Workspace
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary transition-colors">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="font-label text-ink text-sm">Integrity & Policies</h4>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy & Data Storage
                </Link>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  National Scholarship Portal ↗
                </a>
              </li>
              <li>
                <a
                  href="https://ssp.postmatric.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Karnataka SSP Portal ↗
                </a>
              </li>
              <li>
                <a
                  href="https://mahadbt.maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  MahaDBT Portal ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Independent service disclaimer banner (SDD Section 7.1 & 8.2) */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2 max-w-2xl">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <p>
              <strong>Independent Service Notice:</strong> ScholarSteps is an independent guidance platform. We do not accept government applications, guarantee scheme awards, or make official eligibility decisions. All final applications are completed directly on the official state and national portals.
            </p>
          </div>
          <div className="text-right whitespace-nowrap">
            <span>© 2026 ScholarSteps. Version 2.0 (P0).</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
