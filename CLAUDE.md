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

The full build specification is in `FreeMarketWatch_CC_Spec.md`. Read it in full before starting any phase of work.

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

## Project Structure (target)

```
freemarketwatch/
├── CLAUDE.md                  ← this file
├── FreeMarketWatch_CC_Spec.md ← full build specification
├── WEBDESIGN_SKILL.md         ← design system and aesthetic guide
├── .env                       ← secrets (never commit)
├── .env.example               ← committed template
│
├── server/
│   ├── index.ts               ← Express entry point
│   ├── routes/
│   │   ├── series.ts          ← /api/series endpoints
│   │   ├── instruments.ts
│   │   └── health.ts
│   ├── db/
│   │   ├── schema.sql         ← canonical schema
│   │   ├── connection.ts
│   │   └── queries/           ← typed query functions
│   ├── jobs/
│   │   ├── fetchCPI.ts
│   │   ├── fetchFX.ts
│   │   ├── fetchBTC.ts
│   │   ├── fetchEquities.ts
│   │   └── computePPSeries.ts
│   └── lib/
│       ├── thm.ts             ← THM calculation
│       ├── purchasing-power.ts ← PP index calculations
│       └── interpolate.ts     ← date interpolation helpers
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ChartPanel.tsx
│   │   │   ├── DrillDownModal.tsx
│   │   │   ├── BTCToggle.tsx
│   │   │   ├── TimeframeSelector.tsx
│   │   │   └── LogScaleToggle.tsx
│   │   ├── hooks/
│   │   │   ├── useSeriesData.ts
│   │   │   └── useBTCClassification.ts
│   │   └── types/
│   │       └── index.ts
│   └── public/
│
└── docs/
    └── methodology/           ← write-ups for drill-down modals
```

---

## Core Concepts — Must Understand Before Coding

### THM (Theoretical Hard Money)
- Synthetic benchmark. Not fetched from any API. Computed.
- Appreciates at exactly **+2% per year**, compounded
- Represents the natural purchasing power gain of a productive, non-debased economy
- Displayed as a **dashed lime-green line** on every chart
- Everything above THM = gaining real purchasing power. Everything below = losing it.
- Formula: `THM(t) = 100 × (1.02)^years_elapsed`

### USD Purchasing Power
- Source: FRED CPIAUCSL
- Formula: `100 × (CPI_start / CPI_t)` — inverted, so it slopes downward as CPI rises
- This is the real purchasing power of holding dollars, not a forex rate

### Other Currencies
- Formula: exchange rate change vs USD × CPI adjustment
- `100 × (FX_start / FX_t) × (CPI_start / CPI_t)`

### Equities & ETFs
- Real return: nominal price change adjusted for CPI
- `100 × (price_t / price_start) × (CPI_start / CPI_t)`

### BTC
- Same formula as equities (USD price, CPI-adjusted)
- No data before 2009-01-03 — handle gracefully in all chart logic
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
- Free API rate limits are real constraints — be conservative (1 req/sec Yahoo Finance)
- CoinGecko full history: fetch once on setup, then daily deltas only
- CPI history: fetch once back to 1913, then monthly updates
- All jobs must be idempotent — safe to re-run without duplicating data

---

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/freemarketwatch
FRED_API_KEY=          # free at fred.stlouisfed.org — get this first
COINGECKO_API_KEY=     # optional, improves rate limits
PORT=3001
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
- Do not build the education track yet — placeholder routes only
- Do not build user auth yet — design schema to support it, don't implement it
- Do not call APIs repeatedly for data already in the DB
- Do not use `any` types in TypeScript
- Do not make the BTC toggle subtle — it is a featured educational element
- Do not skip the `fetch_log` — observability matters from day one
- Do not use flat table names without prefixes

---

## Current Build Phase

**Phase 1 — Backend Foundation**

In order:
1. Postgres schema (`server/db/schema.sql`)
2. FRED CPI history fetch (back to 1913)
3. FRED FX rates (EUR, JPY, GBP, CNY)
4. CoinGecko BTC full history
5. Yahoo Finance equities (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, TLT, GLD, TIPS)
6. THM calculation function
7. Purchasing power calculation functions
8. `pp_series` computation job
9. Express API endpoints

Do not move to Phase 2 (frontend integration) until all data is flowing and `pp_series` is populated with real numbers.

---

## Open Design Decisions (discuss with user before deciding)

- ORM vs raw SQL (pgTyped, Drizzle, Prisma, or raw `pg`)
- Hosting environment (local dev only for now, but design for eventual deployment)
- Exact 2% THM figure — theoretically motivated but subject to revision
- CPI as deflator — acknowledged as imperfect, may be supplemented later

---

*Last updated: May 2026*
*Companion files: FreeMarketWatch_CC_Spec.md, WEBDESIGN_SKILL.md*
