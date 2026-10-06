# MyPublisher

Self-hosted, all-in-one congregation management application for congregations of Jehovah's Witnesses.

MyPublisher combines publisher records, field service reports, meeting schedules, duties, and territory management into a single, private, self-hosted web app and installable PWA.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend** (`apps/web`): React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS, react-i18next (Spanish default)
- **Backend** (`apps/server`): Hono on Node.js, Zod
- **Database** (`packages/db`): SQLite with Drizzle ORM and `better-sqlite3`
- **Shared** (`packages/shared`): Shared Zod schemas, types, and locale formatting utilities
- **Testing**: Vitest

## Prerequisites

- **Node.js**: v24.x (see `.nvmrc`)
- **pnpm**: v11.x

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development mode:**

   ```bash
   pnpm dev
   ```

   This runs both the Hono backend API (default: `http://localhost:3000`) and the Vite web application (default: `http://localhost:5173`) concurrently. The Vite dev server proxies `/api` requests to the backend.

3. **Open the application:**
   Navigate to `http://localhost:5173` in your browser.

## Monorepo Commands

- `pnpm dev` — Start backend and frontend development servers concurrently
- `pnpm build` — Build all packages and applications for production
- `pnpm test` — Run all unit and integration tests via Vitest
- `pnpm typecheck` — Run TypeScript type checking across all packages
- `pnpm lint` — Run ESLint across the codebase
- `pnpm format` — Format all files with Prettier
- `pnpm format:check` — Verify code formatting with Prettier

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE).
