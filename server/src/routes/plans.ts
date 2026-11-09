import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { demoStore } from '../services/store';

export const plansRouter = Router();

// GET /plans - Scoped strictly to authenticated user (Section 13.2)
plansRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const userPlans = demoStore.plans.get(user.id) || [];
  res.json({
    data: userPlans,
    meta: { total: userPlans.length, requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

// POST /plans - Create new plan scoped to user
plansRouter.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const planData = req.body;

  let userPlans = demoStore.plans.get(user.id);
  if (!userPlans) {
    userPlans = [];
    demoStore.plans.set(user.id, userPlans);
  }

  const newPlan = {
    ...planData,
    id: planData.id || `plan-${Date.now()}`,
    userId: user.id,
    stage: planData.stage || 'PREPARING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  userPlans.unshift(newPlan);
  res.status(201).json({
    data: newPlan,
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

// GET /plans/:id - Enforce ownership
plansRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;
  const userPlans = demoStore.plans.get(user.id) || [];
  const plan = userPlans.find((p) => p.id === id);

  if (!plan) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Preparation plan not found or access denied.' },
    });
  }

  res.json({ data: plan, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

// PATCH /plans/:id - Update notes or details
plansRouter.patch('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;
  const userPlans = demoStore.plans.get(user.id) || [];
  const planIndex = userPlans.findIndex((p) => p.id === id);

  if (planIndex === -1) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Plan not found.' },
    });
  }

  userPlans[planIndex] = {
    ...userPlans[planIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ data: userPlans[planIndex], meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

// PATCH /plans/:id/items/:itemId - Update item status
plansRouter.patch('/:id/items/:itemId', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id, itemId } = req.params;
  const { status, note } = req.body;

  const userPlans = demoStore.plans.get(user.id) || [];
  const plan = userPlans.find((p) => p.id === id);

  if (!plan) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Plan not found' } });
  }

  const item = plan.items?.find((i: any) => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
  }

  item.status = status || item.status;
  if (note !== undefined) item.note = note;
  if (status === 'READY') item.markedReadyAt = new Date().toISOString();
  plan.updatedAt = new Date().toISOString();

  res.json({ data: plan, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

// POST /plans/:id/status - Update application stage with history (Section 7.14)
plansRouter.post('/:id/status', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;
  const { stage, note } = req.body;

  const userPlans = demoStore.plans.get(user.id) || [];
  const plan = userPlans.find((p) => p.id === id);

  if (!plan) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Plan not found' } });
  }

  const previousStage = plan.stage;
  plan.stage = stage;
  plan.updatedAt = new Date().toISOString();

  if (!plan.history) plan.history = [];
  plan.history.push({
    previousStatus: previousStage,
    newStatus: stage,
    note,
    changedAt: new Date().toISOString(),
  });

  res.json({ data: plan, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

// DELETE /plans/:id - Enforce ownership
plansRouter.delete('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;
  const userPlans = demoStore.plans.get(user.id) || [];
  const filtered = userPlans.filter((p) => p.id !== id);

  demoStore.plans.set(user.id, filtered);
  res.json({ data: { success: true }, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

