import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { demoStore } from '../services/store';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const notifs = demoStore.notifications.get(user.id) || [];
  res.json({ data: notifs, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

notificationsRouter.patch('/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { id } = req.params;
  const notifs = demoStore.notifications.get(user.id) || [];
  const notif = notifs.find((n) => n.id === id);

  if (notif) {
    notif.readAt = new Date().toISOString();
  }

  res.json({ data: { success: true }, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

notificationsRouter.post('/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const notifs = demoStore.notifications.get(user.id) || [];
  notifs.forEach((n) => (n.readAt = new Date().toISOString()));

  res.json({ data: { success: true }, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

