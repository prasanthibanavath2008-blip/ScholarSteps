import { Request, Response, NextFunction } from 'express';
import { demoStore, UserEntity } from '../services/store';

export interface AuthenticatedRequest extends Request {
  user?: UserEntity;
  requestId?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  for (const session of demoStore.sessions.values()) {
    if (session.token === token) {
      if (new Date(session.expiresAt) > new Date()) {
        const user = demoStore.users.get(session.userId);
        if (user) {
          req.user = user;
        }
      }
      break;
    }
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication session required.',
        requestId: req.requestId || 'req-id',
      },
    });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Administrative privileges required.',
        requestId: req.requestId || 'req-id',
      },
    });
  }
  next();
}

