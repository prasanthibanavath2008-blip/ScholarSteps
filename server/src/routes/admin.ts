import { Router } from 'express';
import { AuthenticatedRequest, requireAdmin, requireAuth } from '../middleware/auth';
import { demoStore } from '../services/store';

export const adminRouter = Router();

adminRouter.get('/dashboard', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
  const scholarships = demoStore.getAllScholarships();
  const reports = demoStore.reports;
  const auditEvents = demoStore.auditEvents;

  res.json({
    data: {
      metrics: {
        totalScholarships: scholarships.length,
        verifiedCount: scholarships.filter((s) => !s.isSynthetic).length,
        pendingReports: reports.filter((r) => r.status === 'PENDING').length,
        totalAuditEvents: auditEvents.length,
      },
      sourcesDue: scholarships.filter((s) => s.sources[0]?.freshness === 'REVIEW_DUE'),
      recentReports: reports.slice(0, 5),
      recentAudit: auditEvents.slice(-5),
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

adminRouter.get('/sources/review-queue', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
  const scholarships = demoStore.getAllScholarships();
  const queue = scholarships.map((s) => ({
    scholarshipId: s.id,
    name: s.name,
    sources: s.sources,
  }));

  res.json({ data: queue, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

adminRouter.get('/reports', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ data: demoStore.reports, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

adminRouter.get('/audit-events', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ data: demoStore.auditEvents, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

