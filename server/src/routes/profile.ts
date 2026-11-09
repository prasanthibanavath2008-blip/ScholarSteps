import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { demoStore } from '../services/store';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const profile = demoStore.profiles.get(user.id) || { userId: user.id };
  res.json({ data: profile, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

profileRouter.put('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { domicileState, studyLevel, courseGroup, academicYear, preferences } = req.body;

  const updated = {
    userId: user.id,
    domicileState,
    studyLevel,
    courseGroup,
    academicYear,
    preferences,
  };

  demoStore.profiles.set(user.id, updated);
  res.json({ data: updated, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

profileRouter.get('/export', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const profile = demoStore.profiles.get(user.id);
  const plans = demoStore.plans.get(user.id) || [];
  const saved = Array.from(demoStore.savedScholarships.get(user.id) || []);

  res.json({
    data: {
      user: { id: user.id, email: user.email, displayName: user.displayName },
      profile,
      plans,
      savedScholarships: saved,
      exportedAt: new Date().toISOString(),
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

profileRouter.delete('/account', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  demoStore.users.delete(user.id);
  demoStore.profiles.delete(user.id);
  demoStore.plans.delete(user.id);
  demoStore.savedScholarships.delete(user.id);

  res.json({
    data: { success: true, message: 'Your account and personal data have been completely deleted.' },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

