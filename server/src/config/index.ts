import dotenv from 'dotenv';
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  APP_ORIGIN: process.env.APP_ORIGIN || 'http://localhost:5173',
  DATA_MODE: process.env.DATA_MODE || 'demo',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'scholarsteps_session',
  AI_ENABLED: process.env.AI_ENABLED === 'true',
  EMAIL_ENABLED: process.env.EMAIL_ENABLED === 'true',
};

