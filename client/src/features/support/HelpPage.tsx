import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const articles = [
    {
      q: 'How does ScholarSteps verify scholarship information?',
      a: 'Every opportunity listed on ScholarSteps is manually reviewed by our research team against official state gazette circulars, government portals (such as ssp.postmatric.karnataka.gov.in and scholarships.gov.in), and statutory department guidelines. We record the primary source URL, citation excerpt, and review timestamp.',
    },
    {
      q: 'Why does my match result say "More information needed"?',
      a: 'We practice strict three-state evaluation (Pass, Fail, or Unknown). If a scholarship requires a specific criterion that you skipped in the questionnaire (like academic percentage or family income), our engine refuses to guess or falsely pass the rule. It marks the rule as Unknown so you know exactly what needs manual checking.',
    },
    {
      q: 'What is the 15-digit RD Number mentioned for Karnataka SSP?',
      a: 'The Karnataka Revenue Department assigns an RD number to digitized Caste and Income certificates generated at Atalji Janasnehi Kendras (Nemmadi Kendras). The SSP portal uses this 15-digit reference to query state servers directly for income verification without paper submission.',
    },
    {
      q: 'What is NPCI Aadhaar bank seeding for DBT scholarships?',
      a: 'Direct Benefit Transfer (DBT) requires that your bank account is active and mapped with the National Payments Corporation of India (NPCI) mapper. A bank account linked with Aadhaar for KYC is not necessarily seeded for DBT; you must request your bank branch to seed your account with NPCI.',
    },
    {
      q: 'Can ScholarSteps submit my application automatically?',
      a: 'No. ScholarSteps is strictly a preparation platform. All official submissions must occur directly on the authentic government portal. We provide direct links to the verified official portal for each opportunity.',
    },
  ];

  const filtered = articles.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8 sm:py-16 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="font-page-title text-ink">Help & Guidance</h1>
          <p className="font-large-body text-ink-secondary">
            Clear explanations on scholarship procedures, matching logic, and official requirements.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            label="Search questions"
            placeholder="Search keywords (e.g. RD number, NPCI, eligibility)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Articles List */}
        <div className="space-y-4 mb-12">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-card bg-surface border border-border shadow-card space-y-2"
            >
              <h3 className="font-card-title text-lg text-ink">{item.q}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-ink-muted py-8">
              No articles match your search. Try different keywords.
            </p>
          )}
        </div>

        {/* Action Panel */}
        <div className="p-6 rounded-card bg-surface border border-border text-center space-y-4">
          <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
          <h3 className="font-card-title text-lg text-ink">Ready to explore or prepare?</h3>
          <p className="text-sm text-ink-secondary max-w-md mx-auto">
            Take our guided match finder to see potential matches and build your checklist.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/find">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Match Finder
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
