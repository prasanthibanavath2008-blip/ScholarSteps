# ScholarSteps API Documentation

Base Endpoint: `/api/v1`

## Response Conventions
Standard Success:
```json
{
  "data": {},
  "meta": { "requestId": "req-12345" }
}
```

Standard Error:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error explanation",
    "requestId": "req-12345"
  }
}
```

## Core Endpoints

### Health
- `GET /health/live`: Liveness probe.
- `GET /health/ready`: Readiness probe verifying data mode.

### Authentication
- `GET /auth/csrf`: CSRF token for state-changing calls.
- `POST /auth/register`: Create user account (`email`, `password`, `displayName`).
- `POST /auth/login`: Authenticate credentials and return session token.
- `POST /auth/logout`: Invalidate current session.
- `GET /auth/me`: Retrieve authenticated user identity and profile.
- `POST /auth/forgot-password`: Dispatch generic password recovery email.
- `POST /auth/reset-password`: Update password using one-time token.

### Catalog & Matching
- `GET /scholarships`: List scholarships with optional `q`, `state`, `level`, `avail` filters.
- `GET /scholarships/:id`: Get detailed scholarship record.
- `GET /scholarships/:id/sources`: Get verified source references and audit timestamps.
- `POST /matches/evaluate`: Run deterministic 3-state matching across all schemes against submitted answers.
- `POST /matches/scholarships/:id`: Evaluate single scholarship against answers.

### Preparation Plans
- `GET /plans`: List preparation plans owned by authenticated user.
- `POST /plans`: Create new plan with initial checklist items.
- `GET /plans/:id`: Retrieve single plan.
- `PATCH /plans/:id`: Update user notes or plan metadata.
- `DELETE /plans/:id`: Remove plan.
- `PATCH /plans/:id/items/:itemId`: Update checklist item status (`NOT_STARTED`, `IN_PROGRESS`, `READY`) and notes.
- `POST /plans/:id/status`: Update application milestone stage with change history.

### Calendar, Notifications, & Resources
- `GET /calendar/events`: List deadline events.
- `GET /calendar/export.ics`: Generate `.ics` iCalendar calendar feed.
- `GET /notifications`: List in-app alerts.
- `PATCH /notifications/:id/read`: Mark notification read.
- `GET /resources`: List educational guides.
- `GET /resources/:slug`: Fetch guide content.
- `POST /reports`: Submit content issue report.

### Grounded Assistant
- `GET /assistant/status`: Verify explainer provider status.
- `POST /assistant/explain`: Return source-grounded answers to applicant questions.

### Administration
- `GET /admin/dashboard`: Metrics, review queue, and audit summary.
- `GET /admin/sources/review-queue`: Review queue of official URLs.
- `GET /admin/reports`: Community issue reports queue.
- `GET /admin/audit-events`: Chronological administrative audit log.

