import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  CheckSquare,
  HelpCircle,
  Menu,
  X,
  ArrowRight,
  User,
  Layers,
  BookOpen,
  Users,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const baseNavLinks = [
    { label: 'Explore', href: '/scholarships', icon: Compass },
    { label: 'Find my next step', href: '/find', icon: Sparkles },
    { label: 'My preparation', href: '/plans', icon: CheckSquare },
    { label: 'Compare', href: '/compare', icon: Layers },
    { label: 'Resources', href: '/resources', icon: BookOpen },
    { label: 'Advisors', href: '/advisors', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-control shadow-raised"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-border transition-colors">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[76px] flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-ink hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-focus rounded-lg p-1"
            aria-label="ScholarSteps Home"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-heading font-bold shadow-sm">
              <span className="text-accent text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg leading-tight tracking-tight text-ink">
                ScholarSteps
              </span>
              <span className="text-[11px] text-ink-muted leading-none hidden sm:inline">
                NextStep Rebels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {baseNavLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'text-primary font-semibold bg-primary-tint/50'
                      : 'text-ink-secondary hover:text-ink hover:bg-surface-muted/60'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-border bg-surface hover:border-border-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                >
                  <span className="truncate max-w-[120px]">{user?.displayName}</span>
                  <div className="w-7 h-7 rounded-full bg-primary-tint text-primary flex items-center justify-center font-bold">
                    {user?.displayName?.charAt(0) || 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-surface rounded-card border border-border shadow-raised py-2 z-50 text-xs animate-fade-in">
                    <div className="px-4 py-2 border-b border-border">
                      <span className="font-semibold text-ink block truncate">{user?.displayName}</span>
                      <span className="text-ink-muted truncate block">{user?.email}</span>
                      <span className="text-[10px] uppercase font-bold text-primary mt-0.5 block">
                        Role: {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Student Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Academic Profile
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Application Tracker
                    </Link>

                    <Link
                      to="/calendar"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Deadlines & Calendar
                    </Link>

                    <Link
                      to="/notifications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Notifications
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-primary font-semibold hover:bg-primary-tint"
                      >
                        Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-ink hover:bg-surface-muted"
                    >
                      Settings
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-danger hover:bg-danger-tint cursor-pointer"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/find">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Find my next step
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-secondary hover:text-ink hover:bg-surface-muted rounded-control transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-3 animate-sheet-up">
            <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
              {baseNavLinks.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-control transition-colors ${
                      active
                        ? 'text-primary font-semibold bg-primary-tint'
                        : 'text-ink hover:bg-surface-muted'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-ink-muted'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-control text-ink hover:bg-surface-muted"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>Dashboard & Tracker</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-control text-ink hover:bg-surface-muted"
                  >
                    <HelpCircle className="w-4 h-4 text-ink-muted" />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-danger font-medium hover:bg-danger-tint rounded-control"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/find" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full">
                      Find my next step
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
