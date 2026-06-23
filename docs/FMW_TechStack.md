# FreeMarketWatch — Tech Stack

*As-built reference. June 2026.*

---

## Overview

Monorepo with a Node/Express backend and a React SPA frontend, deployed as a single
Railway service. The server handles API routes, scheduled data jobs, and static file
serving. The client is prerendered at build time for static content routes and
hydrated client-side for the dashboard.

```
freemarketwatch/
├── server/        Node.js + Express + TypeScript
├── client/        React + TypeScript + Vite
├── scripts/       Build-time tools (prerender, favicon generation)
└── docs/          Project documentation
```

---

## Frontend

| Concern | Choice |
|---------|--------|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Build tool | Vite 6 |
| Routing | React Router v7 (`BrowserRouter` in client, `StaticRouter` for SSR) |
| Charting | Recharts 2 |
| Styling | CSS-in-JS (inline styles + CSS custom properties in `index.css`) |
| Fonts | Syne (display/headings) + JetBrains Mono (data/labels) via Google Fonts |

### Styling approach

No CSS framework. All component styles are inline React style objects referencing
CSS custom properties defined in `client/src/index.css`. Variables cover backgrounds,
borders, brand accents, text hierarchy, and semantic colors (gain/loss/neutral).

Dark theme throughout — base background `#060810`.

Brand colors:
- THM green: `#a8ff78` (`--thm-green`)
- BTC orange: `#f7931a` (`--btc-orange`)

Text hierarchy:
- `--text-primary: #e2e8f0`
- `--text-secondary: #94a3b8`
- `--text-muted: #64748b`
- `--text-faint: #475569`

### SSR / Prerendering

14 static content routes are prerendered at build time by `scripts/prerender.js`.
The script uses a Vite SSR build (`client/src/entry-server.tsx` with `StaticRouter`)
to render each route to HTML, injects per-page `<title>` and `<meta description>`,
and writes `client/dist/[route]/index.html`.

The dashboard (`/dashboard`) is excluded — it requires live API data.
Admin routes (`/admin`, `/admin/login`) are excluded — auth-gated, served as SPA shell.

---

## Backend

| Concern | Choice |
|---------|--------|
| Runtime | Node.js (ES2022 target) |
| Framework | Express 4 |
| Language | TypeScript compiled to CommonJS via `tsc` |
| Dev server | `tsx watch` (no compile step in development) |
| HTTP client | axios (for external API calls) |
| Scheduling | node-cron |

### Server entry point

`server/index.ts` — mounts all API routers, serves static client files in production,
registers the cron scheduler, and handles graceful SIGTERM shutdown.

### API conventions

- All endpoints under `/api/`
- Response shape: `{ success: boolean, data: T, error?: string }`
- Dates as ISO strings (`YYYY-MM-DD`)
- Window parameter always in years: `?window=1|5|10`

### Routes

| Mount | File | Auth |
|-------|------|------|
| `/api/series` | `routes/series.ts` | Public |
| `/api/instruments` | `routes/instruments.ts` | Public |
| `/api/health` | `routes/health.ts` | Public |
| `/api/learn` | `routes/learn.ts` | Public |
| `/api/contact` | `routes/contact.ts` | POST public; GET/PATCH admin |
| `/api/auth` | `routes/auth.ts` | Public |
| `/api/admin/people` | `routes/adminPeople.ts` | Admin |
| `/api/analytics` | `routes/analytics.ts` | Admin |

---

## Database

| Concern | Choice |
|---------|--------|
| Engine | PostgreSQL |
| Client | `pg` (node-postgres) — no ORM |
| Connection | Single pool in `server/db/connection.ts` |
| Schema | Canonical SQL in `server/db/schema.sql` |
| Migrations | Custom runner (`server/db/migrate.ts`) — numbered SQL files in `server/db/migrations/` |
| Primary keys | `SERIAL` for market tables; `UUID` (`gen_random_uuid()`) for auth and admin tables |
| Timestamps | All tables have `created_at` + `updated_at`; `updated_at` auto-maintained by trigger |

### Migration runner

Applied migrations are tracked in a `migrations` table. Each migration runs in a
transaction — partial failures roll back. Runner executes automatically at startup
via the `npm start` script (`node server/dist/db/migrate.js && node server/dist/index.js`).

### Table namespaces

| Prefix | Purpose |
|--------|---------|
| `market_*` | Price history, purchasing power series, M2/GDP data |
| `user_*` | Authentication, preferences (future public tiers) |
| `admin_*` | CRM contacts, contact messages |
| `index_*` | Proprietary computed indexes (future) |
| `fetch_log` | API fetch audit log (intentionally unprefixed — cross-cutting) |
| `migrations` | Migration tracking |

### Key tables

- `market_instruments` — instrument registry (19 tickers + THM)
- `market_price_history` — raw prices from external APIs
- `market_pp_series` — computed purchasing-power series (primary read layer for charts)
- `market_m2_history` + `market_gdp_history` — M2/GDP data for THM computation
- `user_accounts` — authenticated users with `is_admin` flag and `access_tier`
- `admin_people` — CRM record per unique contact email
- `admin_contact_messages` — contact form submissions linked to admin_people
- `fetch_log` — every external API call logged (success/failure)

---

## Data Pipeline

Six scheduled jobs run in the Node process alongside the HTTP server.

| Job | Schedule (UTC) | Source |
|-----|----------------|--------|
| `fetchCPI` | 02:00 daily | FRED CPIAUCNS |
| `fetchFX` | 02:00 daily | FRED (EUR, JPY, GBP, CNY) |
| `fetchBTC` | 02:00 daily | CryptoCompare |
| `fetchEquities` | 02:00 daily | Yahoo Finance (`yahoo-finance2`) |
| `computePPSeries` | 02:45 daily | Reads DB, writes `market_pp_series` |
| `fetchM2GDP` | 03:00 Sunday | FRED M2SL + GDPC1 |

Fetch jobs run sequentially within the 02:00 window to avoid DB pool contention.
The 45-minute gap before compute ensures all fetches have completed.

All jobs are idempotent — safe to re-run. Data collection rules:
- Never re-fetch static historical data — check DB first, fetch only what's missing
- BTC: full history once on setup, then daily 90-day overlapping incremental
- CPI: full history back to 1913 on setup, then 90-day overlapping incremental
- M2/GDP: full FRED history on setup; weekly refresh
- Pre-FRED M2/GDP (1913–1959): seeded once from `db/seeds/thm_historical_data.ts`
  (Friedman & Schwartz / BEA) — never overwritten

External API keys:
- `FRED_API_KEY` — required; free at fred.stlouisfed.org
- CryptoCompare — no key required
- Yahoo Finance — no key required (`yahoo-finance2` package)

---

## Auth

| Concern | Choice |
|---------|--------|
| Password hashing | bcryptjs (cost factor 12) |
| Tokens | JWT (jsonwebtoken), 7-day expiry, signed with `JWT_SECRET` env var |
| Admin credentials | Stored in `user_accounts` table; seeded via `scripts/create-admin.ts` |
| Middleware | `server/middleware/auth.ts` — `requireAdmin` attaches payload to `req.admin` |
| Frontend token storage | `localStorage` key `fmw_admin_token` |
| Frontend API calls | `client/src/lib/apiFetch.ts` — attaches `Authorization: Bearer <token>` |

No session table — JWT is stateless. Token revocation (e.g., on password change)
requires either short expiry or a token blocklist table (not currently implemented).

---

## Admin Panel

Single-page tab switcher at `/admin`. No sub-routing — tabs switch content inline.
Three tabs: Inbox, People, Analytics.

| Route | Component | Auth |
|-------|-----------|------|
| `/admin/login` | `AdminLogin.tsx` | Public |
| `/admin` | `Admin.tsx` | JWT check on mount → redirect to `/admin/login` |

Admin routes excluded from site NavBar/Footer via `PublicLayout` split in `App.tsx`.
Admin routes excluded from prerender list in `scripts/prerender.js`.

See `docs/REUSABLE_ADMIN_MODULES.md` for full implementation detail.

---

## Analytics

Cloudflare Zone Analytics via GraphQL API. Requires domain proxied through Cloudflare.

| Variable | Purpose |
|----------|---------|
| `CF_ANALYTICS_TOKEN` | API token — "Read analytics and logs", Zone Analytics permission, scoped to this domain |
| `CF_ZONE_ID` | Zone ID from Cloudflare dashboard |

Data is daily aggregates, 1 day behind. 15-minute in-memory cache on the server.
No local DB persistence — queries Cloudflare directly for up to 30 days.

---

## Deployment / Infrastructure

| Concern | Choice |
|---------|--------|
| Host | Railway |
| Database | Railway Postgres (managed) |
| CDN / DNS | Cloudflare |
| Build | Nixpacks detects `package.json`, runs `npm run build` |
| Build command | `npm run build:server && npm run build:client` |
| Start command | `node server/dist/db/migrate.js && node server/dist/index.js` |
| Health check | `GET /api/health` — always returns HTTP 200; staleness in body |
| Config | `railway.json` — Nixpacks builder, health check path, restart on failure |

### Build output

```
server/dist/        Compiled server TypeScript (CommonJS)
client/dist/        Vite client bundle + prerendered HTML files
```

The server serves `client/dist/` as static files in production. Prerendered routes
are served directly as HTML; all other routes fall through to `client/dist/index.html`
(SPA shell).

### Environment variables (full list)

```env
DATABASE_URL=               # Railway Postgres connection string
FRED_API_KEY=               # FRED API — free at fred.stlouisfed.org
PORT=3333                   # Express port
NODE_ENV=development|production
JWT_SECRET=                 # 64-byte random hex string
CF_ANALYTICS_TOKEN=         # Cloudflare analytics token
CF_ZONE_ID=                 # Cloudflare zone ID for this domain
COINGECKO_API_KEY=          # Optional — not currently used (BTC via CryptoCompare)
```

---

## Key Packages

### Server

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.21 | HTTP server |
| pg | ^8.13 | PostgreSQL client |
| axios | ^1.7 | HTTP client for external APIs |
| node-cron | ^3.0 | Job scheduling |
| jsonwebtoken | ^9.0 | JWT signing/verification |
| bcryptjs | ^3.0 | Password hashing |
| yahoo-finance2 | ^2.11 | Yahoo Finance equity data |
| dotenv | ^16.4 | Environment variable loading |
| tsx | ^4.19 | TypeScript execution (dev only) |

### Client

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3 | UI framework |
| react-dom | ^18.3 | DOM rendering |
| react-router-dom | ^7.15 | Client-side routing + StaticRouter for SSR |
| recharts | ^2.13 | Charts (dashboard + admin analytics) |
| vite | ^6.0 | Build tool + dev server |
| typescript | ^5.7 | Type checking |
