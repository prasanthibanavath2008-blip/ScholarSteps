import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authMiddleware } from './middleware/auth';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import { catalogRouter } from './routes/catalog';
import { matchingRouter } from './routes/matching';
import { savedRouter } from './routes/saved';
import { plansRouter } from './routes/plans';
import { calendarRouter } from './routes/calendar';
import { notificationsRouter } from './routes/notifications';
import { resourcesRouter } from './routes/resources';
import { assistantRouter } from './routes/assistant';
import { adminRouter } from './routes/admin';

export const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Assign request ID
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('X-Request-Id', requestId as string);
  (req as any).requestId = requestId;
  next();
});

// Authentication session inspection
app.use(authMiddleware);

// API v1 Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/scholarships', catalogRouter);
app.use('/api/v1/matches', matchingRouter);
app.use('/api/v1/saved-scholarships', savedRouter);
app.use('/api/v1/plans', plansRouter);
app.use('/api/v1/calendar', calendarRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1', resourcesRouter);
app.use('/api/v1/assistant', assistantRouter);
app.use('/api/v1/admin', adminRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.path} was not found.`,
      requestId: (req as any).requestId,
    },
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[API ERROR]', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred.',
      requestId: (req as any).requestId,
    },
  });
});

