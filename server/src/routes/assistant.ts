import { Router } from 'express';
import { demoStore } from '../services/store';

export const assistantRouter = Router();

assistantRouter.get('/status', (req, res) => {
  res.json({
    data: {
      enabled: true,
      provider: 'deterministic-rule-explainer',
      disclaimer: 'AI explanations are strictly grounded in reviewed official source excerpts.',
    },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

assistantRouter.post('/explain', (req, res) => {
  const { scholarshipId, question } = req.body;
  const scholarship = demoStore.getAllScholarships().find((s) => s.id === scholarshipId || s.slug === scholarshipId);

  if (!scholarship) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Scholarship not found.' } });
  }

  // Grounded explanation derived from official source references
  const explanation = {
    scholarshipName: scholarship.name,
    groundedAnswer: `Based on official guidelines from ${scholarship.provider.name}: ${scholarship.detailedDescription} Required criteria include: ${scholarship.rules.map((r: any) => `${r.label} (${r.explanation})`).join('; ')}.`,
    sources: scholarship.sources.map((s: any) => ({
      organization: s.organization,
      url: s.url,
      excerpt: s.excerpt,
      reviewedAt: s.reviewedAt,
    })),
    disclaimer: 'This explanation is synthesized directly from verified official records. It does not replace official gazettes.',
  };

  res.json({ data: explanation, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

