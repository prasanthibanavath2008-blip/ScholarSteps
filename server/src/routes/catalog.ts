import { Router } from 'express';
import { demoStore } from '../services/store';

export const catalogRouter = Router();

catalogRouter.get('/', (req, res) => {
  const { q, state, level, avail } = req.query;
  let list = demoStore.getAllScholarships();

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.provider.name.toLowerCase().includes(query) ||
        s.shortSummary.toLowerCase().includes(query)
    );
  }

  if (state && typeof state === 'string' && state !== 'ALL') {
    list = list.filter(
      (s) =>
        s.domicileStates.includes('All India') ||
        s.domicileStates.some((st: string) => st.toLowerCase() === state.toLowerCase())
    );
  }

  if (level && typeof level === 'string' && level !== 'ALL') {
    list = list.filter((s) => s.studyLevel === 'ALL' || s.studyLevel === level);
  }

  if (avail && typeof avail === 'string' && avail !== 'ALL') {
    list = list.filter((s) => s.availability === avail);
  }

  res.json({
    data: list,
    meta: { total: list.length, requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

catalogRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const item = demoStore.getAllScholarships().find((s) => s.id === id || s.slug === id);
  if (!item) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
    });
  }
  res.json({ data: item, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

catalogRouter.get('/:id/sources', (req, res) => {
  const { id } = req.params;
  const item = demoStore.getAllScholarships().find((s) => s.id === id || s.slug === id);
  if (!item) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
    });
  }
  res.json({ data: item.sources, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

