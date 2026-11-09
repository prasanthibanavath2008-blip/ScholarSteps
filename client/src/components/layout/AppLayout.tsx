import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};

