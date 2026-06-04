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
│   ├── routes/
│   │   ├── series.ts          ← /api/series endpoints
│   │   ├── instruments.ts
│   │   ├── health.ts
│   │   └── learn.ts           ← /api/learn/thm-charts
│   ├── db/
│   │   ├── schema.sql         ← canonical schema
│   │   ├── migrate.ts         ← migration runner
│   │   ├── connection.ts
│   │   ├── migrations/        ← 001_initial_schema.sql, 002_m2_gdp_tables.sql
│   │   ├── queries/
│   │   └── seeds/             ← thm_historical_data.ts (M2/GDP pre-FRED)
│   ├── jobs/
│   │   ├── fetchCPI.ts
│   │   ├── fetchFX.ts
│   │   ├── fetchBTC.ts
│   │   ├── fetchEquities.ts
│   │   ├── fetchM2GDP.ts      ← M2 + GDP from FRED (weekly)
│   │   └── computePPSeries.ts
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
│   │   ├── components/
│   │   │   ├── NavBar.tsx     ← THE LENS dropdown
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ChartPanel.tsx
│   │   │   ├── DrillDownModal.tsx
│   │   │   └── THMExplainer.tsx
│   │   ├── hooks/
│   │   │   ├── useSeriesData.ts
│   │   │   └── useTHMChartData.ts
│   │   ├── pages/             ← Dashboard, About, Contact, LensHub, LensFiat,
│   │   │                         LensTHM, LensInvesting, LearnAct
│   │   ├── content/
│   │   │   └── acts.ts        ← Six-act educational series
│   │   └── types/
│   │       └── index.ts
│   └── public/                ← favicons, site.webmanifest, robots.txt, sitemap.xml, downloads/
│
└── scripts/
    ├── generate-favicons.js
    └── prerender.js           ← Renders 12 static routes to dist/[route]/index.html
```

---

## Core Concepts — Must Understand Before Coding

### THM (Theoretical Hard Money)
- Synthetic benchmark. Not fetched from any API. Computed from M2 and GDP data.
- Displayed as a **dashed lime-green line** on every chart
- Everything above THM = gaining real purchasing power. Everything below = losing it.
- **Primary formula (dashboard):** `THM(t) = 100 × (M2_t / GDP_t) / (M2_start / GDP_start)`
  - THM represents a fixed supply world — as Bitcoin's supply is fixed. M2/GDP is the empirically grounded approximation: it measures how much faster money grew than the economy required, and its inverse is what purchasing power would have been under that fixed supply. Not a guessed deflation rate — 111 years of actual data.
  - Annual M2 and GDP data linearly interpolated to monthly chart points
  - Implemented in `server/lib/thm-m2gdp.ts`
- **Analytical fallback:** `THM(t) = 100 × (1.02)^years_elapsed` — used only if M2/GDP data unavailable
  - Lives in `server/lib/thm.ts`; do not use as the primary definition
- **Three-method comparison** (for `/lens/thm` research charts only, not dashboard):
  - `thm_cpi = 100 × (CPI_t / CPI_1913)`
  - `thm_m2gdp = 100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)` ← preferred
  - `thm_m2raw = 100 × (M2_t / M2_1913)`

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
DATABASE_URL=postgresql://user:pass@localhost:5432/freemarketwatch
FRED_API_KEY=          # free at fred.stlouisfed.org — required for CPI, FX, M2, GDP
COINGECKO_API_KEY=     # optional; BTC is currently fetched via CryptoCompare (no key needed)
PORT=3333
NODE_ENV=development
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

## What Not To Do

- Do not editorialize in UI copy — let the data speak
- Do not build user auth yet — schema supports it, implementation is deferred
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
- The Lens — all three components live at `/lens`, `/lens/fiat`, `/lens/thm`, `/lens/investing`
- Six-act education series at `/lens/fiat/act/1` through `/lens/fiat/act/6`
- Bitcoin/THM framing live: THMExplainer, About, and LensTHM all state the fixed-supply connection explicitly
- SEO prerendering: 12 static routes prerendered at build time; robots.txt + sitemap.xml
- Deployment to Railway + Cloudflare

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

---

*Last updated: June 2026*
*Companion files: WEBDESIGN_SKILL.md, docs/FMW_Vision.md, docs/FMW_Architecture.md, docs/FMW_Content.md*
