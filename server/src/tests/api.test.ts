import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../app';
import http from 'http';

let server: http.Server;
let baseUrl = '';

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe('Server API Endpoints', () => {
  it('GET /api/v1/health/live returns LIVE', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health/live`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe('LIVE');
  });

  it('GET /api/v1/scholarships returns verified opportunities', async () => {
    const res = await fetch(`${baseUrl}/api/v1/scholarships`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(4);
  });

  it('POST /api/v1/matches/evaluate runs three-state matching', async () => {
    const res = await fetch(`${baseUrl}/api/v1/matches/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domicileState: 'Karnataka',
        studyLevel: 'UNDERGRADUATE',
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].evaluation.matchStatus).toBeDefined();
  });

  it('POST /api/v1/auth/login authenticates demo student account', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@example.com',
        password: 'Student@123',
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.token).toBeDefined();
    expect(body.data.user.email).toBe('student@example.com');
  });

  it('GET /api/v1/plans enforces authentication', async () => {
    const res = await fetch(`${baseUrl}/api/v1/plans`);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('UNAUTHENTICATED');
  });
});
