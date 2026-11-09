import { Router } from 'express';
import { demoStore } from '../services/store';
import { evaluateScholarship } from '../../../shared/domain/matching';

export const matchingRouter = Router();

matchingRouter.post('/evaluate', (req, res) => {
  const answers = req.body || {};
  const allScholarships = demoStore.getAllScholarships();

  const results = allScholarships.map((sch) => {
    return {
      scholarship: sch,
      evaluation: evaluateScholarship(sch, answers),
    };
  });

  res.json({
    data: results,
    meta: {
      evaluatedCount: results.length,
      evaluatedAt: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'req-id',
    },
  });
});

matchingRouter.post('/scholarships/:id', (req, res) => {
  const { id } = req.params;
  const answers = req.body || {};
  const sch = demoStore.getAllScholarships().find((s) => s.id === id || s.slug === id);

  if (!sch) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
    });
  }

  const evaluation = evaluateScholarship(sch, answers);
  res.json({
    data: { scholarship: sch, evaluation },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});
