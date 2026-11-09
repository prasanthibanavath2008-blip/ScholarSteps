import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { demoStore, UserEntity } from '../services/store';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.get('/csrf', (req, res) => {
  res.json({
    data: { csrfToken: 'demo-csrf-token-' + Date.now() },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

authRouter.post('/register', (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email, password, and name are required.' },
    });
  }

  const normalized = email.trim().toLowerCase();
  for (const user of demoStore.users.values()) {
    if (user.email.toLowerCase() === normalized) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'An account with this email already exists.' },
      });
    }
  }

  const newUser: UserEntity = {
    id: `usr-${Date.now()}`,
    email: normalized,
    passwordHash: bcrypt.hashSync(password, 8),
    displayName: displayName.trim(),
    role: 'STUDENT',
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };

  demoStore.users.set(newUser.id, newUser);
  demoStore.profiles.set(newUser.id, { userId: newUser.id });

  const token = `tok-${newUser.id}-${Date.now()}`;
  demoStore.sessions.set(token, {
    id: `sess-${Date.now()}`,
    userId: newUser.id,
    token,
    csrfToken: 'demo-csrf',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  });

  res.status(201).json({
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
      },
      token,
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
    });
  }

  const normalized = email.trim().toLowerCase();
  let foundUser: UserEntity | undefined;
  for (const user of demoStore.users.values()) {
    if (user.email.toLowerCase() === normalized) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser || !bcrypt.compareSync(password, foundUser.passwordHash)) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Invalid email or password.' },
    });
  }

  const token = `tok-${foundUser.id}-${Date.now()}`;
  demoStore.sessions.set(token, {
    id: `sess-${Date.now()}`,
    userId: foundUser.id,
    token,
    csrfToken: 'demo-csrf',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  });

  res.json({
    data: {
      user: {
        id: foundUser.id,
        email: foundUser.email,
        displayName: foundUser.displayName,
        role: foundUser.role,
      },
      token,
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

authRouter.post('/logout', (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    demoStore.sessions.delete(token);
  }
  res.json({ data: { success: true }, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const profile = demoStore.profiles.get(user.id);
  res.json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      profile,
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

authRouter.post('/forgot-password', (req, res) => {
  // Generic password-reset response for privacy (Section 7.2)
  res.json({
    data: {
      message: 'If the provided email address exists, password reset instructions have been dispatched.',
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

authRouter.post('/reset-password', (req, res) => {
  res.json({
    data: { message: 'Password has been successfully updated.' },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

