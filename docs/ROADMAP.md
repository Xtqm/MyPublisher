# MyPublisher — v1 Roadmap

> Read [`AGENTS.md`](../AGENTS.md) first. This file is the **build plan and progress tracker**.
> **One agent session = one sub-phase** (e.g. `0A`). Tick checkboxes as you finish them. Leave the repo green (lint, typecheck, tests, build) at the end of every session.

## Milestones

| Milestone | Ends after | Outcome |
|---|---|---|
| **M1 — Reports MVP** | Phase 3 | Publishers submit reports on their phones; secretary finalizes the month; S-1/S-21 print. |
| **M2 — Scheduler** | Phase 6 | Midweek, weekend, duties, field service meetings, attendance. Replaces NW Scheduler. |
| **M3 — v1.0** | Phase 9 | Territories, export/backup, hardening, docs, release. First real-congregation use. |

Every sub-phase must finish with:
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` passing.
- New business logic covered by tests (AGENTS.md §8.4).
- All UI text in Spanish via i18n, and screens checked on a phone-sized viewport.

---

## Phase 0 — Foundation

### 0A — Monorepo & app skeletons
- [ ] pnpm workspace: `apps/web`, `apps/server`, `packages/shared`, `packages/db`, `docs/`
- [ ] Shared tooling: TypeScript (strict, shared base config), ESLint, Prettier, Vitest; root scripts `dev`, `build`, `lint`, `typecheck`, `test`, `format`
- [ ] `apps/server`: Hono on Node, `/api/v1` router, `GET /api/v1/health`, env config validated with Zod, structured logging
- [ ] `packages/db`: Drizzle + SQLite, migration scripts, DB file path from env (default `./data/`), one placeholder table + migration
- [ ] `apps/web`: Vite + React, TanStack Router + Query, Tailwind + shadcn/ui, react-i18next (`es` default, locale-aware date/number helpers), mobile-first app shell (header + bottom nav on phones), self-hosted font, home page that calls the health endpoint
- [ ] PWA manifest + service worker registration (no offline caching logic yet)
- [ ] Dev proxy so web → server works with one `pnpm dev`
- [ ] `.gitignore`, `.editorconfig`, `.nvmrc`, AGPL-3.0 `LICENSE`, short English `README.md` (dev setup)

### 0B — PDF, Docker, CI, seed data
- [ ] Server-side PDF service: pick a library (no headless browser if avoidable; must bundle fonts with Spanish accents) and add `GET /api/v1/dev/sample.pdf`
- [ ] Multi-stage `Dockerfile` (server serves the built web app), `docker-compose.yml` with a `./data` volume, healthcheck
- [ ] GitHub Actions CI: install, lint, typecheck, test, build, docker build
- [ ] Fake seed-data generator (fake Spanish names, never real data), runnable via `pnpm db:seed`

**Phase 0 exit:** `docker compose up` serves the Spanish app shell, the sample PDF renders, and CI is green.

---

## Phase 1 — Auth, users & permissions

### 1A — Authentication & onboarding
- [ ] Better Auth: username/email + password, sessions, secure cookies, CSRF protection, login rate limit
- [ ] First-run setup wizard (creates congregation + first admin; disabled afterwards)
- [ ] Invite-only onboarding (admin creates invite link/code with expiry); no public signup
- [ ] Login/logout/profile screens (Spanish, mobile)

### 1B — Permission engine & default roles
- [ ] Permission catalog in `packages/shared` (resource + action + scope: `own` / `group` / `congregation`)
- [ ] Roles table, user↔role (many-to-many), seeded default roles (AGENTS.md §4)
- [ ] Effective-permission resolution (union across roles) + server authorization middleware
- [ ] Client permission hook (cosmetic only)
- [ ] Thorough unit tests for resolution and scope checks

### 1C — Admin UI, 2FA, audit log
- [ ] Admin screens: users list, assign roles, create/edit/delete roles with permission checkboxes
- [ ] TOTP 2FA: enroll/verify, **enforced for elevated roles**, optional for publishers, recovery codes
- [ ] Audit log (who viewed/changed sensitive records) + admin viewer
- [ ] Tests: 2FA enforcement, role editing, audit entries

---

## Phase 2 — Publishers & field service groups

### 2A — Data model & API
- [ ] Publisher: names, gender, birth/baptism dates, contact info, emergency contacts, family links, away/unavailable dates
- [ ] Privileges/appointments with date ranges (elder, MS, auxiliary/regular/special pioneer, etc.)
- [ ] Field service groups (overseer, assistant, members); user↔publisher link
- [ ] CRUD API with permission + group scoping; contact-info views audit-logged; tests

### 2B — Publisher & group UI
- [ ] Publisher list (search/filter), detail, create/edit forms (mobile-first)
- [ ] Group management screens
- [ ] Seed generator extended with publishers/groups

---

## Phase 3 — Field service reports → **M1**

### 3A — Reporting rules & submission
- [ ] Reporting-rules config as data (fields per publisher category, effective-from dates)
- [ ] Monthly report model; publisher self-submit form
- [ ] Offline draft of the monthly report (PWA) and submit when back online
- [ ] Group overseer / secretary entry on behalf of a publisher
- [ ] Tests: rule selection by date/category, validation, permissions

### 3B — Secretary workflow, S-1 & S-21
- [ ] Secretary dashboard: who hasn't reported, review, edit, **finalize month** (locks the month)
- [ ] S-1 totals calculation (attendance input added in Phase 6) + S-21 card data
- [ ] PDFs: S-21 cards, S-1 summary
- [ ] Publisher's own report history view
- [ ] Tests: S-1/S-21 math, finalize/lock behavior

---

## Phase 4 — Scheduling engine & midweek meeting

### 4A — Suggestion engine (pure logic)
- [ ] Assignment-type catalog with configurable eligibility rules (privileges, gender, qualifications)
- [ ] Candidate ranking: eligibility → availability → time since last assignment (of that type and overall)
- [ ] Conflict detection: double-booking, family pairing, away dates, ineligible assignee
- [ ] Reusable API for v2 auto-fill; exhaustive unit tests

### 4B — Midweek schedule
- [ ] Week editor: parts typed in manually, each slot picker shows ranked suggestions + warnings
- [ ] Draft → published workflow; publishers see published schedules only (cached offline)
- [ ] "My assignments" view
- [ ] PDFs: midweek schedule, assignment slips

---

## Phase 5 — Weekend meeting, duties, field service meetings

### 5A — Weekend meeting
- [ ] Talk outline catalog (number + title, entered manually), speakers (local/visiting), congregations
- [ ] Weekend schedule: chairman, speaker/talk, Watchtower conductor/reader; incoming/outgoing speakers
- [ ] PDF

### 5B — Duties & meetings for field service
- [ ] Duties (attendants, microphones, A/V, platform, cleaning) using the 4A engine
- [ ] Meetings-for-field-service schedule (per group or congregation-wide)
- [ ] PDFs

---

## Phase 6 — Attendance (S-88) → **M2**
- [ ] Quick, phone-friendly attendance entry per meeting
- [ ] Monthly averages, S-88 PDF, attendance fed into S-1
- [ ] Tests for averages

---

## Phase 7 — Territories

### 7A — Territory records & maps
- [ ] Territory model; Leaflet map with polygon drawing; configurable tile URL (default OSM)
- [ ] Upload PDF/image of the paper territory card

### 7B — Assignments & S-13
- [ ] Checkout/return with history; S-13 PDF
- [ ] Publisher phone view of their checked-out territories

---

## Phase 8 — Export & backup
- [ ] Full export (documented JSON bundle + CSVs), with the format kept stable for future importers
- [ ] **Encrypted** backup/restore from the admin UI
- [ ] Opt-in update-available notice
- [ ] Round-trip tests (backup → restore produces the same data)

---

## Phase 9 — Hardening & release → **M3 / v1.0**

### 9A — Security & E2E
- [ ] Authorization coverage audit of every endpoint, security headers, rate limits, dependency audit
- [ ] Playwright E2E for key flows on a phone viewport

### 9B — Docs & release
- [ ] English docs: install, HTTPS / Cloudflare Tunnel, backup/restore, upgrade, user guide per role
- [ ] Publish Docker image, tag `v1.0.0`

---

## Deferred (post-v1)
- Importers for NW Publisher / NW Scheduler / Hourglass
- Cart witnessing, notifications, auto-fill, passkeys, per-address territories, desktop/mobile apps, more languages
