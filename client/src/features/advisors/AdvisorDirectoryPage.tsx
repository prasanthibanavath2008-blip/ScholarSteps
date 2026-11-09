import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Users, ShieldCheck, Mail } from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialization: string;
  verified: boolean;
}

export const AdvisorDirectoryPage: React.FC = () => {
  const [requestModalAdvisor, setRequestModalAdvisor] = useState<Advisor | null>(null);
  const [requestText, setRequestText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const advisors: Advisor[] = [
    {
      id: 'adv-1',
      name: 'Dr. Savitha Rao',
      title: 'Senior College Scholarship Officer',
      institution: 'Karnataka State Higher Education Council Partner',
      specialization: 'SSP Post-Matric, RD Numbers & Revenue E-attestation',
      verified: true,
    },
    {
      id: 'adv-2',
      name: 'Prof. Ramesh Kulkarni',
      title: 'Nodal Officer (Technical Education)',
      institution: 'Government Polytechnic Institute',
      specialization: 'AICTE Pragati, DTE Maharashtra & Merit-Cum-Means Schemes',
      verified: true,
    },
    {
      id: 'adv-3',
      name: 'Anjali Sharma',
      title: 'Community Education Counselor',
      institution: 'NextStep Rebels Guidance Initiative',
      specialization: 'Central Sector Scheme (NSP) & NPCI Banking Seeding',
      verified: true,
    },
  ];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRequestModalAdvisor(null);
      setRequestText('');
    }, 2000);
  };

  return (
    <div className="py-8 sm:py-12 bg-canvas min-h-screen animate-page-entry">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-border">
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Reviewed Directory</span>
          </div>
          <h1 className="font-page-title text-2xl text-ink">Approved Scholarship Advisors</h1>
          <p className="font-large-body text-ink-secondary mt-1 max-w-2xl">
            Connect with verified institutional nodal officers and scholarship counselors through
            structured guidance requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {advisors.map((adv) => (
            <div
              key={adv.id}
              className="bg-surface rounded-card border border-border p-6 shadow-card flex flex-col justify-between hover:border-border-strong hover:shadow-raised transition-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-tint text-primary font-bold text-lg flex items-center justify-center">
                    {adv.name.charAt(0)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-tint px-2.5 py-0.5 rounded-full border border-success/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-card-title text-lg text-ink">{adv.name}</h3>
                  <span className="text-xs font-semibold text-primary block mt-0.5">
                    {adv.title}
                  </span>
                  <span className="text-xs text-ink-muted block mt-0.5">{adv.institution}</span>
                </div>

                <div className="p-3 bg-canvas rounded-control border border-border text-xs text-ink-secondary space-y-1">
                  <span className="font-semibold text-ink uppercase text-[10px] tracking-wider block">
                    Specialization:
                  </span>
                  <p>{adv.specialization}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => setRequestModalAdvisor(adv)}
                  leftIcon={<Mail className="w-3.5 h-3.5" />}
                >
                  Request Guidance
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-control bg-surface border border-border text-xs text-ink-muted flex items-start gap-2 max-w-2xl">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong>Structured Advice Policy:</strong> To protect student privacy, ScholarSteps does
            not maintain a public directory of students or unrestricted messaging. All requests are
            moderated and transmitted within an approved guidance channel.
          </p>
        </div>

        {/* Structured Request Modal */}
        <Modal
          isOpen={Boolean(requestModalAdvisor)}
          onClose={() => setRequestModalAdvisor(null)}
          title={`Guidance request to ${requestModalAdvisor?.name}`}
          description="Briefly describe your scholarship question or document bottleneck."
        >
          {submitted ? (
            <div className="p-4 bg-success-tint border border-success/30 rounded-control text-success text-sm text-center">
              Guidance request dispatched to {requestModalAdvisor?.name}. You will be notified in-app.
            </div>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="font-label text-ink block mb-1">Your Question or Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="e.g. My college admission was completed under second-round CET allotment. Which document proves regular enrollment for SSP?"
                  className="w-full p-3 rounded-control bg-canvas border border-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-focus resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setRequestModalAdvisor(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};
