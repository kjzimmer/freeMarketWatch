# FreeMarketWatch — Claude Code Project Context

> Read this file at the start of every session. It is the authoritative source of project philosophy, architecture decisions, and conventions. When in doubt, refer here before asking the user.

---

## What This Project Is

FreeMarketWatch is a consumer-facing economics education and data dashboard. Its central premise:

> **Purchasing power is the only honest benchmark.** Not the dollar, not Bitcoin, not gold. The question for any asset, currency, or good is: does it maintain, gain, or lose purchasing power over time?

This is **not a Bitcoin site** — though Bitcoin appears as a data series and is presented as the strongest hard money in human history. The hero of the site is honest purchasing power measurement. The data makes the case; the site does not editorialize.

The site has two audiences:
- **The aware** — people who understand markets and want to see reality unfiltered by fiat framing
- **The unaware** — people learning what money is and why debasement matters

The companion documentation set is in `docs/`:
- `FMW_Vision.md` — site purpose, THM definition, Lens structure, what is deferred
- `FMW_Architecture.md` — technical reference: schema, data pipeline, API, deployment
- `FMW_Content.md` — every route, its status, and its content source
- `FMW_TechStack.md` — as-built tech stack reference (packages, versions, conventions)
- `REUSABLE_ADMIN_MODULES.md` — JWT auth, CRM, and analytics modules as reusable patterns

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript |
| Charting | Recharts |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Data jobs | Node-cron |
| Styling | CSS-in-JS / CSS modules — see WEBDESIGN_SKILL.md |

---

## Project Structure (as-built)

```
freemarketwatch/
├── CLAUDE.md                  ← this file
├── WEBDESIGN_SKILL.md         ← design system and aesthetic guide
├── .env                       ← secrets (never commit)
├── .env.example               ← committed template
│
├── docs/
│   ├── FMW_Vision.md          ← site purpose and direction
│   ├── FMW_Architecture.md    ← technical reference
│   ├── FMW_Content.md         ← route/page inventory
│   └── archive/               ← superseded briefing documents
│
├── server/
│   ├── index.ts               ← Express entry point, cron scheduler
│   ├── middleware/
│   │   └── auth.ts            ← requireAdmin middleware; attaches req.admin (AdminPayload)
│   ├── routes/
│   │   ├── series.ts          ← /api/series endpoints
│   │   ├── instruments.ts
│   │   ├── health.ts
│   │   ├── learn.ts           ← /api/learn/thm-charts
│   │   ├── auth.ts            ← POST /api/auth/login, GET /api/auth/me
│   │   ├── contact.ts         ← POST /api/contact (public), GET + PATCH (admin)
│   │   ├── adminPeople.ts     ← CRUD /api/admin/people (admin only)
│   │   └── analytics.ts       ← GET /api/analytics (Cloudflare Zone Analytics, admin only)
│   ├── db/
│   │   ├── schema.sql         ← canonical schema
│   │   ├── migrate.ts         ← migration runner
│   │   ├── connection.ts
│   │   ├── migrations/        ← 001_initial_schema.sql, 002_m2_gdp_tables.sql, 003_auth_and_admin.sql
│   │   ├── queries/
│   │   └── seeds/             ← thm_historical_data.ts (M2/GDP pre-FRED)
│   ├── jobs/
│   │   ├── fetchCPI.ts
│   │   ├── fetchFX.ts
│   │   ├── fetchBTC.ts
│   │   ├── fetchEquities.ts
│   │   ├── fetchM2GDP.ts      ← M2 + GDP from FRED (weekly)
│   │   └── computePPSeries.ts
│   ├── scripts/
│   │   └── create-admin.ts    ← seed first admin user (run once; reads ADMIN_EMAIL/ADMIN_PASSWORD)
│   └── lib/
│       ├── thm.ts             ← Analytical THM (2% fallback only)
│       ├── thm-m2gdp.ts       ← M2/GDP-based THM (primary dashboard)
│       ├── thm-variants.ts    ← Three-method comparison for /lens/thm charts
│       ├── purchasing-power.ts
│       └── interpolate.ts
│
├── client/
│   ├── src/
│   │   ├── App.tsx            ← Routes only — no Router (router-agnostic for SSR)
│   │   ├── main.tsx           ← Client entry: wraps App in BrowserRouter
│   │   ├── entry-server.tsx   ← SSR entry: wraps App in StaticRouter for prerendering
│   │   │   ├── components/
│   │   │   ├── NavBar.tsx     ← THE LENS dropdown
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ChartPanel.tsx
│   │   │   ├── DrillDownModal.tsx
│   │   │   ├── THMExplainer.tsx
│   │   │   └── admin/
│   │   │       ├── AdminContact.tsx   ← Inbox tab: unread/read messages, mark-read
│   │   │       ├── AdminPeople.tsx    ← People tab: list + detail panel with notes/tags
│   │   │       └── AdminAnalytics.tsx ← Analytics tab: Cloudflare stat cards + line chart
│   │   ├── hooks/
│   │   │   ├── useSeriesData.ts
│   │   │   └── useTHMChartData.ts
│   │   ├── lib/
│   │   │   └── apiFetch.ts    ← fetch wrapper; attaches JWT from localStorage 'fmw_admin_token'
│   │   ├── pages/             ← HookPage, Dashboard, About, Contact, LensHub,
│   │   │                         LensFiat, LensTHM, LensInvesting, LensAdoption, LearnAct,
│   │   │                         Admin, AdminLogin
│   │   ├── content/
│   │   │   └── acts.ts        ← Six-act educational series
│   │   └── types/
│   │       └── index.ts
│   └── public/                ← favicons, site.webmanifest, robots.txt, sitemap.xml, downloads/
│
└── scripts/
    ├── generate-favicons.js
    └── prerender.js           ← Renders 14 static routes to dist/[route]/index.html
```

---

## Core Concepts — Must Understand Before Coding

### THM (Theoretical Hard Money)
- Synthetic benchmark. Not fetched from any API. Computed from M2 and GDP data.
- Displayed as a **dashed lime-green line** on every chart
- Everything above THM = keeping pace with or exceeding monetary expansion. Everything below = losing ground.
- **Framing (v4):** THM is a *monetary intensity benchmark* — it measures how much monetary claims (M2) have grown relative to real output (GDP), accumulated from 1913. It is not a simulation of what hard money would have been; it isolates the monetary-claims-versus-output dimension that distinguishes hard money from fiat. Purchasing power is presented as a research question the data explores, not a direct measurement claim.
- **Primary formula (dashboard):** `THM(t) = 100 × (M2_t / GDP_t) / (M2_start / GDP_start)`
  - Derived from decomposing history into Monetary Expansion Factor (M2_t/M2_{t-1}) and Output Growth Factor (GDP_t/GDP_{t-1}). THM accumulates their ratio each period. M2/GDP is not an arbitrary choice — it emerges from this decomposition.
  - Under a fixed supply (Bitcoin-like), M2 is constant, so M2/GDP *falls* as GDP grows — THM would *decline*. The rising THM line is the fiat deviation from that baseline: monetary intensity growing above output.
  - Annual M2 and GDP data linearly interpolated to monthly chart points
  - Implemented in `server/lib/thm-m2gdp.ts`
- **Analytical fallback:** `THM(t) = 100 × (1.02)^years_elapsed` — used only if M2/GDP data unavailable
  - Lives in `server/lib/thm.ts`; do not use as the primary definition
- **Three-method comparison** (for `/lens/thm` research charts only, not dashboard):
  - `thm_cpi = 100 × (CPI_t / CPI_1913)`
  - `thm_m2gdp = 100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)` ← preferred
  - `thm_m2raw = 100 × (M2_t / M2_1913)`
- **Version 1:** future research to test alternative benchmarks (Monetary Base/GDP, Total Credit/GDP, Total Debt/GDP)

### USD Purchasing Power
- Deflator: M2/GDP ratio (FRED M2SL + GDPC1, annual, interpolated to monthly)
- Formula: `100 × (M2GDP_start / M2GDP_t)` where `M2GDP_t = M2_t / GDP_t`
- Same deflator as THM — ensures USD × THM = 100² (exact inverses) at every point
- CPI (FRED CPIAUCNS) is still fetched but is no longer the asset deflator; retained for THM_CPI variant on /lens/thm only

### Other Currencies
- Formula: `100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)`
- FX data from FRED (EUR, JPY, GBP, CNY). Uses US M2/GDP as common deflator — consistent with THM benchmark

### Equities & ETFs
- Real return: nominal price change adjusted by M2/GDP
- Formula: `100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)`

### BTC
- Same formula as equities (USD price, M2/GDP-adjusted)
- Source: CryptoCompare (not CoinGecko). Data from 2010-07-17 — handle gracefully in all chart logic
- **BTC classification**: user can toggle BTC between Currency panel and Risk-On panel
- This toggle is a philosophical/educational feature — both classifications are defensible

---

## Database Conventions

- Table prefix convention: `market_*`, `user_*`, `blog_*`, `index_*`
- Never use flat unprefixed names that could collide with future features
- All tables get `created_at` and `updated_at` timestamps
- Use `UPSERT` (INSERT ... ON CONFLICT DO UPDATE) for all data ingestion
- The schema must accommodate future: user auth, blog, proprietary BTC adoption indexes, access tiers/monetization

Canonical schema is in `server/db/schema.sql`. It is the source of truth — never modify the DB without updating that file.

---

## API Conventions

- All endpoints under `/api/`
- Return shape: `{ success: boolean, data: T, error?: string }`
- Dates always as ISO strings (`YYYY-MM-DD`)
- All pp_index values are numbers, 2 decimal places
- Window parameter is always in years: `?window=1`, `?window=5`, `?window=10`

---

## Data Collection Rules

- **Never re-fetch static historical data** — check DB first, only fetch what's missing
- Log every fetch attempt to `fetch_log` table (success or failure)
- Free API rate limits are real constraints — be conservative (2s pause between Yahoo Finance tickers)
- BTC history (CryptoCompare): full fetch once on setup, then daily 90-day overlapping incremental
- CPI history (FRED CPIAUCNS): full fetch back to 1913 on setup, then 90-day overlapping incremental
- M2/GDP history (FRED M2SL + GDPC1): full fetch from FRED start on setup; weekly refresh (Sunday 03:00 UTC)
- M2/GDP pre-FRED data: seed once from `db/seeds/thm_historical_data.ts` (Friedman & Schwartz / BEA; never overwritten)
- All jobs must be idempotent — safe to re-run without duplicating data

---

## Environment Variables

```
DATABASE_URL=          # Railway Postgres connection string
FRED_API_KEY=          # free at fred.stlouisfed.org — required for CPI, FX, M2, GDP
COINGECKO_API_KEY=     # optional; BTC is currently fetched via CryptoCompare (no key needed)
PORT=3333
NODE_ENV=development
JWT_SECRET=            # 64-byte random hex; generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
CF_ANALYTICS_TOKEN=    # Cloudflare API token — "Read analytics and logs" template, Zone Analytics only
CF_ZONE_ID=            # Cloudflare dashboard → domain overview → right sidebar
# Used only by scripts/create-admin.ts (not read at runtime):
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Never hardcode secrets. Never commit `.env`. Always provide `.env.example` with key names and descriptions.

---

## Design System

See `WEBDESIGN_SKILL.md` for the full design system. Summary:

- **Dark theme** — deep space background (#060810), not pure black
- **Accent** — THM lime green (#a8ff78) is the primary brand color
- **BTC orange** (#f7931a) as secondary accent
- **Typography** — Syne (display) + JetBrains Mono (data/labels)
- **Charts** — Recharts, THM always dashed, reference line at y=100
- **Tone** — serious data tool with clarity and restraint. Not a crypto hype site.
- Every chart has a "methodology ↗" drill-down. No data without provenance.

---

## Keeping llms.txt Current

`client/public/llms.txt` is served at `https://freemarketwatch.world/llms.txt`. It allows AI systems to understand the site without browsing. **Update it whenever:**
- A new page or route is added
- A page's status changes (e.g., "In development" → live)
- The THM methodology or data sources change
- Major copy changes on About, the Lens hub, or the Dashboard

The file follows the [llms.txt standard](https://llmstxt.org): plain markdown, one `# Title`, a blockquote summary, description paragraphs, then `## Sections` with links. Keep descriptions accurate and concise — this is what another AI reads to understand the site.

---

## What Not To Do

- Do not editorialize in UI copy — let the data speak
- Do not add public user registration or email verification — schema supports it but implementation is deferred
- Do not call APIs repeatedly for data already in the DB
- Do not use `any` types in TypeScript
- Do not make the BTC toggle subtle — it is a featured educational element
- Do not skip the `fetch_log` — observability matters
- Do not use flat table names without prefixes
- Do not use the analytical 2% THM formula as the primary dashboard definition — use M2/GDP

---

## Current State — June 2026

The site is fully operational. All data pipelines are live. All Lens content is published.

**What is complete:**
- All backend data jobs (CPI, FX, BTC, equities, M2/GDP)
- Dashboard with three panels, 1/5/10Y windows, BTC toggle
- THM line on dashboard using M2/GDP basis
- Hook page at `/` — Version A copy, smart routing via `fmw_visited` localStorage flag, returns returning visitors to `/dashboard`
- Dashboard moved to `/dashboard` (was `/`)
- The Lens — all four components live: `/lens/fiat`, `/lens/thm`, `/lens/investing`, `/lens/adoption` (adoption is a placeholder)
- Six-act education series at `/lens/fiat/act/1` through `/lens/fiat/act/6`
- Bitcoin/THM framing live: THMExplainer, About, and LensTHM all state the fixed-supply connection explicitly
- SEO prerendering: 14 static routes prerendered at build time; robots.txt + sitemap.xml
- Deployment to Railway + Cloudflare
- JWT auth (`user_accounts` table, bcryptjs cost 12, 7-day tokens) with `requireAdmin` middleware
- Admin panel at `/admin` — Inbox (contact messages), People CRM, Cloudflare Analytics tabs
- Contact form posts to `/api/contact` (Formspree removed); auto-creates `admin_people` record on submission
- Cloudflare Zone Analytics: daily aggregates, 15-min in-memory cache, stat cards + line chart in admin

**What is deferred (see FMW_Content.md for detail):**
- Dashboard THM toggle (switch between CPI/M2GDP/M2RAW definitions)
- MM/Cash instrument data
- Component 3 investing dashboard tools
- Additional instruments (more currencies, commodities)

**Resolved design decisions:**
- ORM: raw `pg` (no ORM)
- THM formula: M2/GDP basis (not 2% analytical)
- Deployment: Railway + Cloudflare
- Purchasing power deflator: M2/GDP basis (not CPI) — consistent with THM benchmark
- CPI (FRED CPIAUCNS): retained in DB and fetched, used only for THM_CPI variant on /lens/thm
- Admin routing: `App.tsx` splits into `PublicLayout` (NavBar + Footer) and top-level `/admin` + `/admin/login` routes with no nav chrome; admin routes excluded from prerender
- Contact backend: Formspree removed; contact form POSTs to `/api/contact`; `admin_people` records created automatically on every contact submission (upsert on email)
- Auth storage: JWT in `localStorage` key `fmw_admin_token`; no session table (stateless)

---

*Last updated: June 2026*
*Companion files: WEBDESIGN_SKILL.md, docs/FMW_Vision.md, docs/FMW_Architecture.md, docs/FMW_Content.md*
