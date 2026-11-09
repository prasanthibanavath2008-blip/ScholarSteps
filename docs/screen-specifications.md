# ScholarSteps Screen Specifications

This document catalogs all implemented screens across P0, P1, and P2 releases.

## P0 Screens (Core Student Journey)
1. **Home (`/`)**: Asymmetric editorial hero with three-line maximum heading, step-line motif sequence, illustrative preparation preview, three-point value strip, 3-step methodical workflow, featured cards, trust-and-limits transparency comparison, and 180–220ms smooth FAQ accordion.
2. **Scholarship Explorer (`/scholarships`)**: 3-column desktop filter rail (state, study level, cycle), debounced search input, active filter chips, shareable public URL query parameters, and a mobile bottom sheet filter modal.
3. **Scholarship Details (`/scholarships/:slug`)**: 8-column main content column (overview, benefits breakdown, checked eligibility rules, required documents list, official 4-step sequence, verified source provenance panel) and sticky 4-column action panel with direct start-plan CTA, match check, and content reporting modal.
4. **Guided Match Finder (`/find`)**: 3-step calm questionnaire (1. Study & Location, 2. Criteria & Income with sensitive question transparency notice, 3. Review & Evaluate) with draft auto-saving in browser storage.
5. **Match Results (`/matches`)**: Shortlist metric tiles (Potential Matches, Needs More Information, Does Not Match), rule-by-rule explanation list, matching limitations disclaimer, with zero celebratory confetti or false 100% claims.
6. **Preparation Workspace (`/plans` & `/plans/:id`)**:
   - List state: Shows all active preparation plans, calculated readiness percentage, and next recommended actions.
   - Detail state: 3-state checklist item status (`NOT_STARTED`, `IN_PROGRESS`, `READY` ["Marked ready by you"]), auto-saving student notes, and `.txt` summary export.
7. **Help & FAQs (`/help`)**: Searchable guidance on RD numbers, NPCI mapper seeding, and matching limitations.
8. **Privacy Policy (`/privacy`)**: Plain-language storage policy, data collection bounds, and local browser wipe controls.

## P1 Screens (Full-Stack & Account Expansion)
9. **Authentication (`/login`, `/register`, `/forgot-password`, `/verify-email`)**: Split editorial layout, secure credential inputs, generic password reset response, and one-click evaluator demo access.
10. **Student Dashboard (`/dashboard`)**: Metric tiles (Active Plans, Tasks Remaining, Upcoming Deadlines), next recommended action cards, and toolkit shortcuts.
11. **Student Profile (`/profile`)**: Manage domicile state, enrolled study level, course discipline, and academic year.
12. **Application Stage Tracker (`/applications`)**: Kanban/list tracker spanning stages `EXPLORING` -> `PREPARING` -> `READY_TO_APPLY` -> `SUBMITTED` -> `AWARDED`. Confirmation modal before marking submitted.
13. **Deadlines & Calendar (`/calendar`)**: Chronological agenda view and standard `.ics` file generator.
14. **Notifications (`/notifications`)**: In-app date-grouped source freshness and deadline updates.
15. **Resource Library (`/resources`, `/resources/:slug`)**: In-depth reviewed guides on state revenue numbers, bank seeding, and income declarations.
16. **Settings (`/settings`)**: Session details, privacy preferences, and browser data purge controls.
17. **Content Administration (`/admin`)**: Editorial review queue, verified source tracking, community content report triaging, and immutable version audit history.

## P2 Screens (Advanced Capabilities)
18. **Comparison Matrix (`/compare`)**: Side-by-side comparison of up to 3 schemes across benefits, criteria, documents, and verified deadlines.
19. **Advisor Directory (`/advisors`)**: Approved institutional nodal officers with structured, private guidance request dialogs.
20. **Grounded AI Explainer**: Source-grounded requirement summarization without hallucinations or eligibility decisions.

