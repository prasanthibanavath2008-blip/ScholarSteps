import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../lib/auth';

describe('AuthService: User Information & Session Management', () => {
  beforeEach(() => {
    AuthService.clearSession();
  });

  it('registers a user with their correct name and email without overriding with demo names', async () => {
    const res = await AuthService.register({
      displayName: 'Prasad Sharma',
      email: 'prasad.sharma@example.in',
      phone: '+91 9876543210',
      domicileState: 'Maharashtra',
    });

    expect(res.success).toBe(true);
    expect(res.user).toBeDefined();
    expect(res.user?.displayName).toBe('Prasad Sharma');
    expect(res.user?.email).toBe('prasad.sharma@example.in');
    expect(res.user?.domicileState).toBe('Maharashtra');

    const session = AuthService.getCurrentSession();
    expect(session).toBeDefined();
    expect(session?.user.displayName).toBe('Prasad Sharma');
    expect(session?.user.email).toBe('prasad.sharma@example.in');
  });

  it('logs in an existing user with their correct registered information', async () => {
    await AuthService.register({
      displayName: 'Ananya Verma',
      email: 'ananya@example.com',
      domicileState: 'Uttar Pradesh',
    });

    // Clear active session to simulate new session
    AuthService.clearSession();
    expect(AuthService.getCurrentSession()).toBeNull();

    // Log back in
    const loginRes = await AuthService.login({
      email: 'ananya@example.com',
      password: 'mypassword123',
    });

    expect(loginRes.success).toBe(true);
    expect(loginRes.user?.displayName).toBe('Ananya Verma');
    expect(loginRes.user?.email).toBe('ananya@example.com');

    const activeSession = AuthService.getCurrentSession();
    expect(activeSession?.user.displayName).toBe('Ananya Verma');
  });

  it('updates profile and personal identity correctly', async () => {
    await AuthService.register({
      displayName: 'Rohan Gupta',
      email: 'rohan@example.com',
      domicileState: 'Delhi',
    });

    AuthService.saveProfile({
      displayName: 'Rohan Gupta (Updated)',
      phone: '+91 9988776655',
      domicileState: 'Tamil Nadu',
      academicScore: '92',
    });

    const profile = AuthService.getProfile();
    expect(profile.displayName).toBe('Rohan Gupta (Updated)');
    expect(profile.phone).toBe('+91 9988776655');
    expect(profile.domicileState).toBe('Tamil Nadu');
    expect(profile.academicScore).toBe('92');

    const session = AuthService.getCurrentSession();
    expect(session?.user.displayName).toBe('Rohan Gupta (Updated)');
  });

  it('allows explicit demo student for evaluation without affecting normal registration', () => {
    const demo = AuthService.loginAsDemo('STUDENT');
    expect(demo.role).toBe('STUDENT');
    expect(demo.displayName).toContain('Demo');
  });
});

