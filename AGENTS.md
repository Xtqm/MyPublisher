# MyPublisher — Agent Context

> **Read this file first.** It is the source of truth for what this project is, why decisions were made, and the rules every AI agent must follow. If a decision here changes, **update this file in the same change** (see §8).

_Last updated: 2026-10-05 — project status: **greenfield (no code yet)**. Build plan & progress: [`docs/ROADMAP.md`](docs/ROADMAP.md)._

---

## 1. What this project is

**MyPublisher** is a **self-hosted, all-in-one congregation management application** for congregations of Jehovah's Witnesses. It combines what congregations currently do across three separate tools into **one simple, easy-to-use app**:

| Existing tool | What MyPublisher replaces from it |
|---|---|
| **NW Publisher** | Publisher records, field service reports, S-21 cards, S-1 branch report, attendance |
| **NW Scheduler** | Midweek & weekend meeting schedules, duties, printable schedules |
| **Hourglass** | Web/phone access for publishers, self-submitted reports, field service groups |

**Primary values (in priority order):**
1. **Privacy** — congregation data never leaves the congregation's own server.
2. **Simplicity** — easy for publishers and overseers; easy for a volunteer brother to host.
3. **Completeness** — one app instead of three.

**Primary UI language for v1: Spanish.** (Developer-facing content is English — see §8.)

---

## 2. Deployment model

- **Each congregation runs its own copy** (like NW Publisher). There is **no central/multi-tenant SaaS**. One install = one congregation.
- A **moderately technical brother** hosts the server (home PC, NAS, Raspberry Pi, or cheap VPS) using a **one-command Docker install**.
- Everyone else (admins, overseers, publishers) uses a **web browser / installable PWA**.
- Must work both **LAN-only** and **exposed over HTTPS** (reverse proxy, Cloudflare Tunnel, etc.).
- Admin UI must provide **built-in backup/restore** and an **update-available notice**.
- **Future clients (not v1):** Tauri desktop app, then a mobile app (React Native / Capacitor). Architect the API so these can be added without backend rewrites (clean, versioned HTTP API; no server-rendered-only logic).
- **Distribution:** free and open source (**AGPL-3.0**) on GitHub. **Documentation is English only.**

---

## 3. v1 scope (MVP)

### In scope
1. **Publisher records** — contact info, privileges, appointments (elder, MS, pioneer types), field service group, family links, emergency contacts, unavailability/away dates.
2. **Field service reports** — see §5.
3. **Midweek meeting (Life & Ministry) schedule** — assignments entered **manually** (see §6).
4. **Weekend meeting schedule** — public talks, speakers, talk outlines, incoming/outgoing speakers, Watchtower conductor/reader, chairman.
5. **Duties** — attendants, microphones, audio/video, platform, cleaning.
6. **Field service groups & meetings for field service** schedule.
7. **Territories** — see §7.
8. **Meeting attendance tracking (S-88).**
9. **Printing / PDF export** of schedules and forms (S-21, S-1 summaries, S-13, S-88, meeting schedules).
10. **Full data export** (complete backup + CSV) — congregations must never be locked in.

### Explicitly out of scope for v1 (roadmap)
- **Data import** from NW Publisher / NW Scheduler / Hourglass (deferred until real export formats are available). Keep the export format documented and stable so importers can be added later.
- Public witnessing (cart) scheduling
- Notifications (email / SMS / push)
- One-click schedule **auto-fill** (v2 — see §6)
- Passkeys / WebAuthn (v2)
- Per-address territory records and do-not-call lists
- Desktop and mobile native apps
- Additional UI languages (infrastructure exists from day one; translations later)

---

## 4. Roles & permissions

- **Role-based access control with granular permissions.**
- The app ships with **default roles** mirroring congregation structure, each with **default permissions**:
  - Admin (setup / IT)
  - Coordinator of the Body of Elders
  - Secretary
  - Service Overseer
  - Life & Ministry Meeting Overseer
  - Public Talk Coordinator
  - Group Overseer / Group Assistant (scoped to **their own group only**)
  - Duty / Attendant / A-V coordinator
  - Territory Servant
  - Publisher (own data + published schedules only)
- **Admins can edit any role's permissions, create new roles, and delete roles.**
- A user can hold **multiple roles**; effective permissions are the union.
- Permissions must support **scope** (e.g. "view reports" for *own group* vs *whole congregation*).
- **All authorization is enforced server-side.** UI hiding is cosmetic only.
- Permission checks are business logic → **must have tests**.

---

## 5. Field service reports

Follow the **current (Nov 2023+) reporting format**:
- **Publishers** report: *participated in the ministry (yes/no)*, *number of Bible studies*, *comments*.
- **Auxiliary, regular, and special pioneers** additionally report **hours**, including **credit hours**.

Workflow:
1. Publisher submits via the app **or** a group overseer / secretary enters it on their behalf.
2. Secretary sees **who hasn't reported**, reviews, and **finalizes the month**.
3. App produces **S-1 totals** (branch report) and updates **S-21 cards**.

**Reporting rules must be stored as data/configuration, not hard-coded**, so the app can adapt if the organization changes the format (e.g. which fields each publisher category reports, effective-from dates).

---

## 6. Scheduling (midweek, weekend, duties, field service)

- **Meeting content is entered manually.** Do **not** fetch, scrape, or parse content from jw.org, and do not import EPUB/JWPUB files. (Avoids Terms-of-Use and copyright concerns.)
- **Smart-assist, not auto-generate (v1):** the overseer builds the schedule; the app helps by:
  - Suggesting candidates **ranked** by eligibility (privileges, gender, qualifications for the part), availability (away/unavailable dates), and **time since last assignment** (of that type and overall).
  - **Warning on conflicts**: double-booking in the same meeting, same-family pairing rules, scheduled during away dates, ineligible assignee.
- Eligibility rules for each assignment type should be **configurable data**, not scattered conditionals.
- Schedules have a **draft → published** state; publishers only see published schedules.
- One-click auto-fill is planned for **v2** — keep the suggestion engine reusable for it.

---

## 7. Territories

- Territory boundaries drawn on an **OpenStreetMap-based map** (Leaflet).
- Ability to **attach an uploaded PDF/image** of the paper territory card.
- Track checkout / return dates and history (**S-13**).
- Publishers can view **their checked-out territories on their phone**.
- Map tile server URL is **configurable**, defaulting to public OSM tiles. This is the **one documented exception** to the no-external-calls rule (§8).

---

## 8. Hard rules for AI agents (MUST follow)

1. **Language split:** all code, identifiers, comments, commit messages, and docs are **English**. Only **user-facing UI strings** are Spanish, and they live in i18n resource files.
2. **Never hard-code UI text.** Every user-visible string goes through an i18n key (`react-i18next`). Dates, times, and numbers must be locale-aware.
3. **Mobile-first UI.** Every screen must work well on a phone before it is considered done.
4. **Tests are required for business logic** before a feature is "done" — at minimum: permissions/authorization, report totals and S-1/S-21 calculations, reporting-rule handling, scheduling eligibility/ranking/conflict detection, export and backup/restore round-trips.
5. **Never commit real publisher data.** Use fake/generated seed data only. Never put real names, addresses, or reports in tests, fixtures, screenshots, or docs.
6. **No external network calls without explicit approval from the owner.** This includes analytics, telemetry, error-reporting SaaS, CDNs, remote fonts/icons, and third-party APIs. All assets are bundled. The only approved exception is the configurable map tile server (§7).
7. **Keep this file updated** whenever an architecture decision, scope item, or rule changes.
8. **Work from the roadmap.** The build plan lives in [`docs/ROADMAP.md`](docs/ROADMAP.md). Each agent session implements **one sub-phase** (e.g. `0A`), stays inside its scope, ticks the completed checkboxes, and leaves the repo green (lint, typecheck, tests, build). Do not start the next sub-phase unasked.
9. **Spanish UI text** should use the terminology congregations already use in Spanish-language publications and forms (e.g. *publicador*, *precursor regular*, *informe de predicación*, *superintendente de grupo*). The owner reviews all Spanish strings; flag any term you are unsure of in your session summary.

---

## 9. Security & privacy baseline

| Requirement | Decision |
|---|---|
| Authentication | Email/username + password (strong hashing via the auth library) |
| 2FA | **TOTP mandatory for elevated roles** (any role with access to other people's data); optional for publishers |
| Onboarding | **Invite-only** — admin invites users; **no public self-signup** |
| Passkeys | v2 |
| Encryption at rest | **Backups are encrypted.** Docs instruct hosts to use OS/disk encryption. No field-level encryption (not worth the complexity). |
| Audit log | Record who **viewed or changed** sensitive records (reports, contact info, permissions) |
| Telemetry | **Zero.** The app never phones home. (An update-check, if added, must be opt-in and approved.) |
| Network | Works on LAN-only and behind HTTPS; secure cookies, CSRF protection, rate-limited login |

---

## 10. Architecture & tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** end-to-end | One language; shared types; strong AI-agent support |
| Repo | **pnpm workspaces monorepo** | Share code between web, server, and future desktop/mobile apps |
| Frontend | **React + Vite**, installable **PWA** | React enables reuse in future React Native mobile & Tauri desktop apps |
| Routing / data | **TanStack Router + TanStack Query** | Type-safe routing; caching that supports offline viewing |
| UI | **Tailwind CSS + shadcn/ui** | Fast, accessible, mobile-friendly; components live in-repo (no runtime CDN) |
| i18n | **react-i18next** | Mature; Spanish default; easy to add languages |
| Maps | **Leaflet** with configurable OSM tile URL | Lightweight, privacy-friendly |
| Backend | **Hono on Node.js** | Small, fast, clean HTTP API usable by any future client |
| Database | **SQLite** (`better-sqlite3`) via **Drizzle ORM** | Single-file DB = trivial backup/restore for a volunteer host; Drizzle keeps a Postgres migration path open; `better-sqlite3` provides robust, high-performance synchronous access with prebuilt binaries across Windows, Linux Docker, and ARM (Raspberry Pi) |
| Auth | **Better Auth** (self-hosted) | Sessions, TOTP 2FA now, passkeys later; no external service |
| Validation | **Zod**, schemas shared client/server | Single source of truth for data shapes |
| PDF | **Server-side PDF generation** | Consistent printable forms/schedules across devices |
| Testing | **Vitest** (unit/integration), **Playwright** (E2E) | |
| Packaging | **Single Docker image** (+ `docker-compose.yml`) with a mounted data volume | One-command install/update |

### Offline behavior
- The app is **online-first**.
- PWA exceptions: publishers can **view cached published schedules** and **draft their monthly report offline**, then submit when back online.
- Full offline-first sync is **not** a goal.

### Suggested repo layout (to be created)
```
/apps/web        React PWA
/apps/server     Hono API, auth, PDF generation, export & backup/restore
/packages/shared Zod schemas, types, permission definitions, reporting rules, i18n keys
/packages/db     Drizzle schema & migrations
/docs            English documentation (install, backup, upgrade, user guides)
```

---

## 11. Glossary (for agents unfamiliar with the domain)

- **Publisher** — a congregation member who participates in the preaching work.
- **Pioneer** — publisher with an hour goal: *auxiliary* (temporary), *regular*, or *special*.
- **Elder / Ministerial Servant (MS)** — appointed men; many roles/assignments require these.
- **Field service group** — subgroup of the congregation led by a group overseer.
- **Midweek meeting** — "Our Christian Life and Ministry" meeting; parts come from the monthly workbook.
- **Weekend meeting** — public talk + Watchtower Study.
- **S-1** — monthly congregation report to the branch.
- **S-21** — Congregation's Publisher Record card (per-publisher yearly report history).
- **S-13** — Territory Assignment Record.
- **S-88** — Record of Meeting Attendance.
- **Credit hours** — approved non-ministry hours pioneers may count (e.g. theocratic construction).
