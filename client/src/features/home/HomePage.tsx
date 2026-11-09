import React from 'react';
import { HeroSection } from './HeroSection';
import { ValueStrip } from './ValueStrip';
import { HowItWorks } from './HowItWorks';
import { FeaturedScholarships } from './FeaturedScholarships';
import { TrustAndLimitsPanel } from './TrustAndLimitsPanel';
import { FaqAccordion } from './FaqAccordion';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full animate-page-entry">
      <HeroSection />
      <ValueStrip />
      <HowItWorks />
      <FeaturedScholarships />
      <TrustAndLimitsPanel />
      <FaqAccordion />
    </div>
  );
};

