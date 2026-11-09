# ScholarSteps Deployment Guide

## Architecture Topology
```text
Browser
  │
  ▼
Single Origin (HTTPS)
  ├── Frontend Assets (Vite SPA)
  └── /api/v1 → Express Server (Node.js)
        │
        ▼
     PostgreSQL (DATA_MODE=postgres)
        or
     Reviewed Fixtures & Session Store (DATA_MODE=demo)
```

## Environment Variables
Ensure `.env` contains:
```ini
NODE_ENV=production
PORT=4000
DATA_MODE=demo # or postgres
DATABASE_URL=postgresql://user:password@localhost:5432/scholarsteps
SESSION_COOKIE_NAME=scholarsteps_session
SESSION_IDLE_MINUTES=60
SESSION_ABSOLUTE_HOURS=168
```

## Build and Start
```bash
# Build both frontend and backend
npm run build

# Start backend
npm --workspace=server start

# Serve frontend with static server or reverse proxy (Nginx / Cloud Run)
```

