import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { demoStore } from '../services/store';

export const savedRouter = Router();

savedRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const savedIds = Array.from(demoStore.savedScholarships.get(user.id) || []);
  const all = demoStore.getAllScholarships();
  const savedScholarships = all.filter((s) => savedIds.includes(s.id));

  res.json({
    data: savedScholarships,
    meta: { total: savedScholarships.length, requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

savedRouter.put('/:scholarshipId', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { scholarshipId } = req.params;

  let userSet = demoStore.savedScholarships.get(user.id);
  if (!userSet) {
    userSet = new Set();
    demoStore.savedScholarships.set(user.id, userSet);
  }

  userSet.add(scholarshipId);
  res.json({
    data: { success: true, saved: true, scholarshipId },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

savedRouter.delete('/:scholarshipId', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { scholarshipId } = req.params;

  const userSet = demoStore.savedScholarships.get(user.id);
  if (userSet) {
    userSet.delete(scholarshipId);
  }

  res.json({
    data: { success: true, saved: false, scholarshipId },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

