import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ResourceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const contentMap: Record<string, { title: string; category: string; content: string[] }> = {
    'understanding-rd-certificates': {
      title: 'A Student Guide to Karnataka Revenue RD Numbers',
      category: 'Documentation',
      content: [
        'The Karnataka Revenue Department implements Atalji Janasnehi Kendra (Nemmadi Kendra) across all taluks to digitize citizen records.',
        'When an applicant secures a Caste or Income certificate, the document is tagged with a unique 15-digit barcode reference starting with "RD".',
        'State scholarship portals, including the SSP Post-Matric platform, interface with the Revenue Department database using this RD number.',
        'This direct electronic link eliminates paper submission and reduces physical verification bottlenecks at college nodal counters.',
        'Key Action Item: Before starting your SSP application, visit your local Nemmadi Kendra or apply on ajsk.karnataka.gov.in to verify that your certificate RD number is active and issued within the required financial cycle.',
      ],
    },
    'npci-aadhaar-seeding-guide': {
      title: 'How to Verify NPCI Aadhaar Mapping for Direct Benefit Transfer',
      category: 'Banking',
      content: [
        'Direct Benefit Transfer (DBT) is the government mandate for sending scholarship allowances directly into recipient bank accounts via Aadhaar Payment Bridge.',
        'Many students confuse standard Aadhaar KYC linkage with NPCI bank account seeding.',
        'A bank account linked to Aadhaar for identity verification may still fail DBT transfers if it has not been registered on the NPCI mapper as your primary DBT destination.',
        'Step 1: Check your current status on resident.uidai.gov.in/bank-mapper using your Aadhaar credentials.',
        'Step 2: If no active bank is mapped, visit your bank branch and submit the "NPCI Aadhaar Seeding Consent Form" stamped by the branch manager.',
      ],
    },
    'income-ceilings-and-documents': {
      title: 'Understanding Family Income Ceilings in State Welfare Schemes',
      category: 'Eligibility',
      content: [
        'Statutory post-matric assistance programs enforce family income ceilings to ensure funds reach economically vulnerable students.',
        'Under Karnataka SSP: General welfare and SC/ST income limits typically allow up to ₹2.5 Lakh per annum.',
        'Under Central Sector Scheme (NSP): Family income must not exceed ₹4.5 Lakh per annum.',
        'Under AICTE Pragati & MahaDBT EBC: Ceiling extends up to ₹8 Lakh per annum for eligible girl students or economically backward general categories.',
        'Always obtain an official income certificate from the Tahsildar or authorized Sub-Divisional Magistrate for the current financial cycle.',
      ],
    },
  };

  const article = slug ? contentMap[slug] : undefined;

  if (!article) {
    return (
      <div className="py-20 text-center max-w-content mx-auto px-4">
        <h2 className="font-card-title text-xl text-ink">Resource guide not found</h2>
        <Link to="/resources" className="mt-4 inline-block">
          <Button variant="primary">Return to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-16 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6" aria-label="Breadcrumb">
          <Link to="/resources" className="hover:text-primary transition-colors">
            Resource Library
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-medium truncate">{article.title}</span>
        </nav>

        <article className="bg-surface rounded-card border border-border p-6 sm:p-10 shadow-card space-y-6">
          <div className="space-y-2 border-b border-border pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {article.category}
            </span>
            <h1 className="font-page-title text-2xl sm:text-3xl text-ink leading-tight">
              {article.title}
            </h1>
            <p className="text-xs text-ink-muted">
              Reviewed by ScholarSteps Editorial Team • Statutory Guidance
            </p>
          </div>

          <div className="space-y-4 text-base text-ink leading-relaxed font-body">
            {article.content.map((paragraph, idx) => (
              <p key={idx} className="text-ink-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between text-xs">
            <Link
              to="/resources"
              className="inline-flex items-center gap-1 text-ink-secondary hover:text-primary font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Library</span>
            </Link>

            <Link to="/scholarships" className="font-semibold text-primary hover:underline">
              Browse scholarships →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
