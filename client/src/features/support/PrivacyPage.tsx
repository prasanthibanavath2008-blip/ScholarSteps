import React, { useState } from 'react';
import { StorageService } from '../../lib/storage';
import { Button } from '../../components/ui/Button';
import { Lock, Trash2, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to delete all saved preparation plans and questionnaire drafts from this browser?'
      )
    ) {
      StorageService.clearAllData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="py-8 sm:py-16 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Storage</span>
          </div>
          <h1 className="font-page-title text-ink">Privacy Policy & Storage</h1>
          <p className="font-large-body text-ink-secondary">
            Version 2.0 (P0 Release) • Last updated: November 2026
          </p>
        </div>

        <div className="space-y-8 bg-surface rounded-card border border-border p-6 sm:p-10 shadow-card text-ink text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-card-title text-xl text-ink">1. Plain-Language Summary</h2>
            <p className="text-ink-secondary">
              ScholarSteps is designed on a <strong>privacy-by-default</strong> model. In our P0
              release, we do not require account creation, logins, or server-side transmission of
              personal answers. All your questionnaire inputs, checklist progress, and notes stay
              exclusively within your device's browser local storage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-card-title text-xl text-ink">2. What We Collect and Store</h2>
            <p className="text-ink-secondary">
              When using the platform as a guest user:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-ink-secondary">
              <li>
                <strong>Questionnaire Responses:</strong> Stored locally under key{' '}
                <code className="text-xs bg-canvas px-1.5 py-0.5 rounded border border-border font-mono">
                  scholarsteps:v1:draft_answers
                </code>
                .
              </li>
              <li>
                <strong>Preparation Plans & Checklists:</strong> Stored locally under key{' '}
                <code className="text-xs bg-canvas px-1.5 py-0.5 rounded border border-border font-mono">
                  scholarsteps:v1:plans
                </code>
                .
              </li>
              <li>
                <strong>UI Preferences:</strong> Filter settings and layout options.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-card-title text-xl text-ink">3. What We Do NOT Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-ink-secondary">
              <li>We do NOT collect Aadhaar numbers or biometric identities.</li>
              <li>We do NOT store bank passwords or UPI pins.</li>
              <li>We do NOT upload or host student identity certificates or marksheets.</li>
              <li>We do NOT pass sensitive questionnaire attributes into URL parameters or web analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-card-title text-xl text-ink">4. Third-Party Links</h2>
            <p className="text-ink-secondary">
              ScholarSteps links to official state and national government scholarship portals (such
              as <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">scholarships.gov.in</a> and <a href="https://ssp.postmatric.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">ssp.postmatric.karnataka.gov.in</a>). When you follow an outbound link, the destination portal's privacy policy and data governance apply.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="font-card-title text-xl text-ink">5. Data Deletion Controls</h2>
            <p className="text-ink-secondary">
              You maintain full sovereignty over your browser storage. You can wipe all local
              progress and reset ScholarSteps at any time using the button below:
            </p>

            <div className="pt-2">
              <Button
                variant="destructive"
                onClick={handleClearAll}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear all browser data & reset
              </Button>

              {cleared && (
                <p className="mt-2 text-xs text-success font-medium flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All local plans and questionnaire drafts have been cleared.</span>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
