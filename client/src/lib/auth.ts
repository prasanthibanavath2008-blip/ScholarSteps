import { useState, useEffect } from 'react';
import { StorageService } from './storage';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'STUDENT' | 'EDITOR' | 'ADMIN' | 'ADVISOR';
  phone?: string;
  domicileState?: string;
}

export interface StudentProfileData {
  displayName: string;
  email: string;
  phone?: string;
  domicileState: string;
  studyLevel: string;
  courseGroup: string;
  academicYear: string;
  academicScore: string;
  familyIncomeBracket?: string;
}

const AUTH_STORAGE_KEY = 'scholarsteps:v1:auth_session';
const REGISTERED_USERS_KEY = 'scholarsteps:v1:registered_users';
const PROFILE_STORAGE_KEY = 'scholarsteps:v1:student_profile';

const nodeAuthStore = new Map<string, string>();

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const test = '__auth_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return window.localStorage;
    } catch {
      return null;
    }
  }

  // Node CLI / Vitest test environment
  if (typeof window === 'undefined') {
    return {
      getItem: (k: string) => nodeAuthStore.get(k) ?? null,
      setItem: (k: string, v: string) => {
        nodeAuthStore.set(k, v);
      },
      removeItem: (k: string) => {
        nodeAuthStore.delete(k);
      },
    };
  }

  return null;
}

function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('scholarsteps_auth_change'));
  }
}

export class AuthService {
  static getCurrentSession(): { user: AuthUser; token: string } | null {
    try {
      const storage = getStorage();
      if (!storage) return null;
      const raw = storage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static setSession(user: AuthUser, token: string) {
    try {
      const storage = getStorage();
      if (storage) {
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      }
      notifyAuthChange();
    } catch {}
  }

  static clearSession() {
    try {
      const storage = getStorage();
      if (storage) {
        storage.removeItem(AUTH_STORAGE_KEY);
      }
      notifyAuthChange();
    } catch {}
  }

  static getRegisteredUsers(): AuthUser[] {
    try {
      const storage = getStorage();
      if (!storage) return [];
      const raw = storage.getItem(REGISTERED_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  static saveRegisteredUsers(users: AuthUser[]) {
    try {
      const storage = getStorage();
      if (storage) {
        storage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      }
    } catch {}
  }

  static getProfile(): StudentProfileData {
    try {
      const storage = getStorage();
      if (storage) {
        const raw = storage.getItem(PROFILE_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {}

    const session = this.getCurrentSession();
    return {
      displayName: session?.user.displayName || '',
      email: session?.user.email || '',
      phone: session?.user.phone || '',
      domicileState: session?.user.domicileState || 'Karnataka',
      studyLevel: 'UNDERGRADUATE',
      courseGroup: 'ENGINEERING',
      academicYear: '2026-27',
      academicScore: '85',
      familyIncomeBracket: 'BELOW_2_LAKH',
    };
  }

  static saveProfile(data: Partial<StudentProfileData>) {
    try {
      const storage = getStorage();
      const current = this.getProfile();
      const updated: StudentProfileData = { ...current, ...data };
      if (storage) {
        storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      }

      const session = this.getCurrentSession();
      if (session) {
        const updatedUser: AuthUser = {
          ...session.user,
          displayName: updated.displayName || session.user.displayName,
          email: updated.email || session.user.email,
          phone: updated.phone || session.user.phone,
          domicileState: updated.domicileState || session.user.domicileState,
        };
        this.setSession(updatedUser, session.token);

        const accounts = this.getRegisteredUsers();
        const accIdx = accounts.findIndex(
          (a) => a.id === updatedUser.id || a.email.toLowerCase() === updatedUser.email.toLowerCase()
        );
        if (accIdx >= 0) {
          accounts[accIdx] = updatedUser;
          this.saveRegisteredUsers(accounts);
        }
      }
      notifyAuthChange();
    } catch {}
  }

  static async register(params: {
    displayName: string;
    email: string;
    password?: string;
    phone?: string;
    domicileState?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const displayName = params.displayName.trim();
    const email = params.email.trim().toLowerCase();
    const phone = params.phone?.trim() || '';
    const domicileState = params.domicileState || 'Karnataka';

    if (!displayName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }

    const accounts = this.getRegisteredUsers();
    const existingIndex = accounts.findIndex((a) => a.email.toLowerCase() === email);

    let activeUser: AuthUser;
    if (existingIndex >= 0) {
      accounts[existingIndex].displayName = displayName;
      if (phone) accounts[existingIndex].phone = phone;
      if (domicileState) accounts[existingIndex].domicileState = domicileState;
      activeUser = accounts[existingIndex];
    } else {
      activeUser = {
        id: `usr-${Date.now()}`,
        email,
        displayName,
        role: 'STUDENT',
        phone,
        domicileState,
      };
      accounts.push(activeUser);
    }

    this.saveRegisteredUsers(accounts);
    this.setSession(activeUser, 'tok-' + activeUser.id);

    this.saveProfile({
      displayName,
      email,
      phone,
      domicileState,
      studyLevel: 'UNDERGRADUATE',
      courseGroup: 'ENGINEERING',
      academicYear: '2026-27',
      academicScore: '85',
    });

    // Sync with backend if available
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: params.password || 'P@ssword123', displayName }),
        }).catch(() => {});
      }
    } catch {}

    return { success: true, user: activeUser };
  }

  static async login(params: {
    email: string;
    password?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const email = params.email.trim().toLowerCase();
    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }

    if (email === 'admin@scholarsteps.org') {
      const admin = this.loginAsDemo('ADMIN');
      return { success: true, user: admin };
    }

    const accounts = this.getRegisteredUsers();
    const existing = accounts.find((a) => a.email.toLowerCase() === email);
    if (existing) {
      this.setSession(existing, 'tok-' + existing.id);
      return { success: true, user: existing };
    }

    // Try backend authentication
    try {
      if (typeof fetch !== 'undefined') {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: params.password }),
        });
        if (res.ok) {
          const body = await res.json();
          if (body.data?.user) {
            const user: AuthUser = {
              id: body.data.user.id,
              email: body.data.user.email,
              displayName: body.data.user.displayName,
              role: body.data.user.role || 'STUDENT',
            };
            this.setSession(user, body.data.token || 'tok-' + user.id);
            this.saveRegisteredUsers([...accounts, user]);
            return { success: true, user };
          }
        }
      }
    } catch {}

    // Derive display name from email (e.g. prasad.rao@gmail.com -> Prasad Rao)
    const localPart = email.split('@')[0];
    const derivedName =
      localPart
        .split(/[._-]/)
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ') || 'Student';

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      displayName: derivedName,
      role: 'STUDENT',
    };

    accounts.push(user);
    this.saveRegisteredUsers(accounts);
    this.setSession(user, 'tok-' + user.id);
    return { success: true, user };
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
      email: 'demo.student@scholarsteps.org',
      displayName: 'Demo Student (Evaluation)',
      role: 'STUDENT',
    };
    this.setSession(studentUser, 'demo-token-student');

    // Seed sample plan for demo student if empty
    const localPlans = StorageService.getPlans();
    if (localPlans.length === 0) {
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

    if (typeof window !== 'undefined') {
      window.addEventListener('scholarsteps_auth_change', handleAuthChange);
      return () => window.removeEventListener('scholarsteps_auth_change', handleAuthChange);
    }
  }, []);

  return {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.user),
    isAdmin: session?.user?.role === 'ADMIN',
    logout: () => AuthService.clearSession(),
    register: (params: {
      displayName: string;
      email: string;
      password?: string;
      phone?: string;
      domicileState?: string;
    }) => AuthService.register(params),
    login: (params: { email: string; password?: string }) => AuthService.login(params),
    updateProfile: (profile: Partial<StudentProfileData>) => AuthService.saveProfile(profile),
    getProfile: () => AuthService.getProfile(),
    loginAsDemo: (role?: 'STUDENT' | 'ADMIN') => AuthService.loginAsDemo(role),
  };
}
