import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (req, res) => {
  res.json({
    data: { status: 'LIVE', uptime: process.uptime(), timestamp: new Date().toISOString() },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

healthRouter.get('/ready', (req, res) => {
  res.json({
    data: { status: 'READY', dataMode: process.env.DATA_MODE || 'demo' },
    meta: { requestId: req.headers['x-request-id'] || 'req-id' },
  });
});

