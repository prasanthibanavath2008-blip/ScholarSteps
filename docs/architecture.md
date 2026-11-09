# ScholarSteps Architecture

## Overview
ScholarSteps is a scholarship discovery and preparation platform designed to turn reliable scholarship information into actionable student preparation.

## Operating Modes
- `DATA_MODE=demo`: Operates on reviewed real government scholarship fixtures and visibly labeled synthetic edge-case fixtures. Guest plans persist in browser `localStorage` using versioned namespaces (`scholarsteps:v1:plans`, `scholarsteps:v1:preferences`).
- `DATA_MODE=postgres`: Full-stack cloud storage with authenticated PostgreSQL sessions (P1 extension).

## P0 Core Principles
1. **Deterministic Matching**: Three-state evaluation (`PASS`, `FAIL`, `UNKNOWN`). Missing answers are strictly `UNKNOWN`, never `PASS`.
2. **Transparent Provenance**: Every scholarship links to its official primary source, last reviewed timestamp, reviewer notes, and excerpts.
3. **Readiness != Eligibility**: Readiness measures self-reported preparation checklist completeness, explicitly distinct from official award decisions or government verification.
4. **Local Privacy**: Guest answers and checklists remain on the user's browser; no sensitive data in URLs or analytics.

