import { useState, useEffect } from 'react';
import { StorageService } from './storage';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'STUDENT' | 'EDITOR' | 'ADMIN' | 'ADVISOR';
}

const AUTH_STORAGE_KEY = 'scholarsteps:v1:auth_session';

export class AuthService {
  static getCurrentSession(): { user: AuthUser; token: string } | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static setSession(user: AuthUser, token: string) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      window.dispatchEvent(new Event('scholarsteps_auth_change'));
    } catch {}
  }

  static clearSession() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event('scholarsteps_auth_change'));
    } catch {}
  }

  static loginAsDemo(role: 'STUDENT' | 'ADMIN' = 'STUDENT') {
    if (role === 'ADMIN') {
      const adminUser: AuthUser = {
        id: 'usr-admin-demo',
        email: 'admin@scholarsteps.org',
        displayName: 'Editorial Administrator',
        role: 'ADMIN',
      };
      this.setSession(adminUser, 'demo-token-admin');
      return adminUser;
    }

    const studentUser: AuthUser = {
      id: 'usr-student-demo',
      email: 'student@example.com',
      displayName: 'Arun Kumar',
      role: 'STUDENT',
    };
    this.setSession(studentUser, 'demo-token-student');

    // Also import any local guest plans if present
    const localPlans = StorageService.getPlans();
    if (localPlans.length === 0) {
      // Seed initial sample plan for dashboard if none exists
      StorageService.savePlan({
        id: 'plan-ssp-demo',
        scholarshipId: 'ssp-karnataka-postmatric-2026',
        scholarshipSlug: 'ssp-karnataka-postmatric',
        scholarshipName: 'Karnataka State Scholarship Portal (SSP) Post-Matric Scheme',
        providerName: 'Social Welfare & Backward Classes Welfare Dept, Govt of Karnataka',
        versionId: 1,
        cycleLabel: '2026-27 Academic Cycle',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        officialPortalUrl: 'https://ssp.postmatric.karnataka.gov.in/',
        items: [
          {
            id: 'demo-item-1',
            title: 'Caste & Income Certificate (15-digit RD Number)',
            description: 'Obtain RD number from Nemmadi Kendra',
            requirementType: 'REQUIRED',
            applicability: 'APPLICABLE',
            status: 'READY',
            markedReadyAt: new Date().toISOString(),
          },
          {
            id: 'demo-item-2',
            title: 'Aadhaar Seeding with NPCI Bank Account',
            description: 'Verify active DBT bank mapping',
            requirementType: 'REQUIRED',
            applicability: 'APPLICABLE',
            status: 'IN_PROGRESS',
          },
          {
            id: 'demo-item-3',
            title: 'College Admission Fee Receipt & USN',
            description: 'Official fee slip stamped by college',
            requirementType: 'REQUIRED',
            applicability: 'APPLICABLE',
            status: 'NOT_STARTED',
          },
        ],
        sourceVersionCheckDate: new Date().toISOString(),
      });
    }

    return studentUser;
  }
}

export function useAuth() {
  const [session, setSessionState] = useState(() => AuthService.getCurrentSession());

  useEffect(() => {
    const handleAuthChange = () => {
      setSessionState(AuthService.getCurrentSession());
    };

    window.addEventListener('scholarsteps_auth_change', handleAuthChange);
    return () => window.removeEventListener('scholarsteps_auth_change', handleAuthChange);
  }, []);

  return {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.user),
    isAdmin: session?.user?.role === 'ADMIN',
    logout: () => AuthService.clearSession(),
    loginAsDemo: (role?: 'STUDENT' | 'ADMIN') => AuthService.loginAsDemo(role),
  };
}

