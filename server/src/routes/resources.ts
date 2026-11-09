import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { demoStore } from '../services/store';

export const resourcesRouter = Router();

resourcesRouter.get('/resources', (req, res) => {
  res.json({ data: demoStore.resources, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

resourcesRouter.get('/resources/:slug', (req, res) => {
  const { slug } = req.params;
  const resource = demoStore.resources.find((r) => r.slug === slug || r.id === slug);
  if (!resource) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource article not found' } });
  }
  res.json({ data: resource, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

resourcesRouter.post('/reports', (req: AuthenticatedRequest, res) => {
  const { scholarshipId, category, description } = req.body;
  if (!scholarshipId || !category || !description) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Scholarship, category, and description are required.' },
    });
  }

  const report = {
    id: `rep-${Date.now()}`,
    userId: req.user?.id || null,
    scholarshipId,
    category,
    description,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  demoStore.reports.unshift(report);
  res.status(201).json({ data: report, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

