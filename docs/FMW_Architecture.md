# FreeMarketWatch — Technical Architecture
## June 2026

---

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React + TypeScript | React 18, TS 5.7 |
| Charting | Recharts | — |
| Routing | React Router v7 | 7.15 |
| Backend | Node.js + Express | Express 4.21 |
| Database | PostgreSQL | — |
| ORM/DB client | Raw `pg` (no ORM) | pg 8.13 |
| Scheduled jobs | node-cron | 3.0 |
| HTTP client | axios | 1.7 |
| Runtime | tsx (dev) / tsc (prod) | tsx 4.19, TS 5.7 |
| Build | Vite (client) | — |

---

## Repository Structure

```
freemarketwatch/
├── CLAUDE.md                  ← CC working reference (keep up to date)
├── .env                       ← secrets (never commit)
├── .env.example               ← committed template (keys only, no values)
├── package.json               ← root build scripts
│
├── docs/                      ← documentation
│   ├── FMW_Vision.md          ← site purpose and direction
│   ├── FMW_Architecture.md    ← this file
│   ├── FMW_Content.md         ← page/route inventory
│   └── archive/               ← superseded briefing and draft documents
│
├── server/
│   ├── index.ts               ← Express entry point, route registration, scheduler
│   ├── package.json
│   ├── tsconfig.json
│   ├── routes/
│   │   ├── series.ts          ← /api/series and /api/series/group endpoints
│   │   ├── instruments.ts     ← /api/instruments endpoint
│   │   ├── health.ts          ← /api/health endpoint
│   │   └── learn.ts           ← /api/learn/thm-charts endpoint
│   ├── db/
│   │   ├── schema.sql         ← canonical schema (source of truth)
│   │   ├── migrate.ts         ← migration runner (applies files from migrations/)
│   │   ├── connection.ts      ← pg Pool instance (DATABASE_URL)
│   │   ├── migrations/
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_m2_gdp_tables.sql
│   │   ├── queries/
│   │   │   └── fetchLog.ts    ← logFetch() helper
│   │   └── seeds/
│   │       └── thm_historical_data.ts  ← static M2/GDP data (1913–1958/1946)
│   ├── jobs/
│   │   ├── fetchCPI.ts        ← FRED CPIAUCNS → market_cpi_history
│   │   ├── fetchFX.ts         ← FRED FX series → market_fx_history
│   │   ├── fetchBTC.ts        ← CryptoCompare → market_price_history
│   │   ├── fetchEquities.ts   ← Yahoo Finance → market_price_history
│   │   ├── fetchM2GDP.ts      ← FRED M2SL + GDPC1 → market_m2_history + market_gdp_history
│   │   └── computePPSeries.ts ← Rebuilds market_pp_series (purchasing power index)
│   └── lib/
│       ├── env.ts             ← dotenv loader
│       ├── thm.ts             ← Analytical THM formula (2% fallback only)
│       ├── thm-m2gdp.ts       ← M2/GDP-based THM for dashboard (primary)
│       ├── thm-variants.ts    ← Three-method THM comparison for /lens/thm charts
│       ├── purchasing-power.ts ← PP index calculation functions
│       └── interpolate.ts     ← Linear interpolation utilities
│
├── client/
│   ├── index.html             ← Entry point, fonts, favicon, meta
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.svg        ← Master favicon (three diverging lines on dark bg)
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── site.webmanifest
│   │   ├── robots.txt         ← Allows all crawlers; points to sitemap
│   │   ├── sitemap.xml        ← All 13 public routes (static + dynamic)
│   │   └── downloads/         ← PDF/PPTX downloads (linked from /lens/fiat)
│   └── src/
│       ├── App.tsx            ← All routes (router-agnostic; BrowserRouter in main.tsx, StaticRouter in entry-server.tsx)
│       ├── main.tsx           ← Client entry point; wraps App in BrowserRouter
│       ├── entry-server.tsx   ← SSR entry point; wraps App in StaticRouter for prerendering
│       ├── components/
│       │   ├── NavBar.tsx     ← Fixed top nav; THE LENS dropdown with three sub-items
│       │   ├── Footer.tsx     ← Footer links
│       │   ├── Header.tsx     ← Dashboard header (window + BTC toggle)
│       │   ├── ChartPanel.tsx ← Single chart panel (Recharts LineChart + legend + modal)
│       │   ├── DrillDownModal.tsx ← Methodology popup for each chart panel
│       │   └── THMExplainer.tsx   ← Collapsible dashboard explainer
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── About.tsx
│       │   ├── Contact.tsx
│       │   ├── LensHub.tsx
│       │   ├── LensFiat.tsx
│       │   ├── LensTHM.tsx
│       │   ├── LensInvesting.tsx
│       │   ├── LearnAct.tsx        ← Act renderer (used at /lens/fiat/act/:n)
│       │   ├── LearnSoundMoney.tsx ← Legacy (not routed; superseded by LensFiat)
│       │   └── LearnTHM.tsx        ← Legacy (not routed; superseded by LensTHM)
│       ├── hooks/
│       │   ├── useSeriesData.ts    ← Fetches group series for dashboard charts
│       │   └── useTHMChartData.ts  ← Fetches THM variant data for /lens/thm charts
│       ├── content/
│       │   ├── acts.ts            ← Six-act educational series content
│       │   └── topics.ts          ← Topic glossary (not currently rendered in UI)
│       └── types/
│           └── index.ts           ← All shared types, SERIES_COLORS, PANEL_CONFIG
│
└── scripts/
    ├── generate-favicons.js   ← CJS script: generates PNG favicons from favicon.svg
    └── prerender.js           ← CJS script: renders static routes to dist/[route]/index.html at build time
```

---

## Environment Variables

All required variables live in `.env` (local) or Railway Variables tab (production). Never commit `.env`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string: `postgresql://user:pass@host:port/dbname` |
| `FRED_API_KEY` | Yes | Free API key from fred.stlouisfed.org — required for CPI, FX, M2, GDP fetches |
| `COINGECKO_API_KEY` | No | Optional; improves CoinGecko rate limits. Currently unused (BTC fetched via CryptoCompare) |
| `PORT` | No | Server port; defaults to 3333 |
| `NODE_ENV` | No | `development` or `production`; affects CORS and static file serving |

---

## Database Schema

All tables have `created_at TIMESTAMPTZ` and `updated_at TIMESTAMPTZ` columns with an auto-update trigger.

---

### `market_instruments`
Instrument registry. Populated once from `001_initial_schema.sql`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `ticker` | VARCHAR(10) UNIQUE | THM, USD, EUR, JPY, GBP, CNY, BTC, AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, TLT, GLD, TIPS, MM, CASH |
| `name` | VARCHAR(100) | Display name |
| `group_name` | VARCHAR(20) | 'currency', 'riskoff', 'riskon', 'special' |
| `data_source` | VARCHAR(50) | 'FRED', 'CoinGecko', 'YahooFinance', 'calculated' |
| `frequency` | VARCHAR(10) | 'daily', 'monthly', or NULL |
| `notes` | TEXT | |

---

### `market_price_history`
Daily closing prices for equities, ETFs, and BTC.

| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGSERIAL PK | |
| `ticker` | VARCHAR(10) FK → market_instruments | |
| `date` | DATE | |
| `value` | NUMERIC(20,8) | Closing price in USD (adjusted close) |
| `currency` | VARCHAR(5) DEFAULT 'USD' | |
| `source` | VARCHAR(50) | 'YahooFinance', 'CryptoCompare' |
| `fetched_at` | TIMESTAMPTZ | |
Unique: `(ticker, date)`

---

### `market_cpi_history`
Monthly CPI (Consumer Price Index) from FRED.

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `date` | DATE UNIQUE | First day of reference month |
| `cpi_value` | NUMERIC(10,4) | |
| `source` | VARCHAR(50) DEFAULT 'FRED_CPIAUCSL' | Actually uses CPIAUCNS (not seasonally adjusted) |
| `fetched_at` | TIMESTAMPTZ | |
Coverage: January 1913 – present

---

### `market_fx_history`
Daily FX rates for EUR, JPY, GBP, CNY.

| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGSERIAL PK | |
| `currency_code` | VARCHAR(5) | EUR, JPY, GBP, CNY |
| `date` | DATE | |
| `rate_vs_usd` | NUMERIC(16,8) | Units of foreign currency per 1 USD |
| `source` | VARCHAR(50) | 'FRED_DEXUSEU' etc. |
| `fetched_at` | TIMESTAMPTZ | |
Unique: `(currency_code, date)`. Coverage: 1971-01-01 – present.

---

### `market_pp_series`
Purchasing power index — the primary read layer for dashboard charts. Rebuilt daily.

| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGSERIAL PK | |
| `ticker` | VARCHAR(10) | No FK — intentional; allows proprietary tickers |
| `date` | DATE | |
| `pp_index` | NUMERIC(16,6) | **100.00 at window_start**; M2/GDP-adjusted |
| `nominal_index` | NUMERIC(16,6) nullable | Dollar-denominated, not deflated |
| `window_years` | SMALLINT | 1, 5, or 10 |
| `window_start` | DATE | Start of computation window |
| `computed_at` | TIMESTAMPTZ | |
Unique: `(ticker, date, window_years)`. Fully rebuilt on each `computePPSeries` run.

---

### `market_m2_history`
Annual M2 money supply. Used exclusively for THM M2/GDP calculation.

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `date` | DATE UNIQUE | First day of reference year |
| `m2_billions` | NUMERIC(16,4) | USD billions |
| `source` | VARCHAR(100) | 'FRED_M2SL' or 'Friedman_Schwartz' |
| `fetched_at` | TIMESTAMPTZ | |
Coverage: 1913–present. Added in migration `002_m2_gdp_tables.sql`.

---

### `market_gdp_history`
Annual real GDP. Used exclusively for THM M2/GDP calculation.

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL PK | |
| `date` | DATE UNIQUE | First day of reference year |
| `gdp_billions` | NUMERIC(16,4) | Chained 2017 USD |
| `source` | VARCHAR(100) | 'FRED_GDPC1' or 'BEA_Historical' |
| `fetched_at` | TIMESTAMPTZ | |
Coverage: 1913–present. Added in migration `002_m2_gdp_tables.sql`.

---

### `fetch_log`
Operational audit log. Every fetch attempt (success or failure) is recorded.

| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGSERIAL PK | |
| `source` | VARCHAR(50) | 'FRED_CPI', 'FRED_FX', 'CryptoCompare_BTC', 'YahooFinance', 'compute_pp_series', 'FRED_M2', 'FRED_GDP' |
| `endpoint` | VARCHAR(500) | Full URL fetched |
| `fetched_at` | TIMESTAMPTZ | |
| `records_added` | INT | |
| `success` | BOOLEAN | |
| `error_msg` | TEXT | Null on success |
Used by `/api/health` to detect stale data (threshold: 2 days without successful fetch).

---

### `migrations`
Migration tracking table. Created by `migrate.ts` on first run.

| Column | Type |
|--------|------|
| `id` | SERIAL PK |
| `filename` | VARCHAR(255) UNIQUE |
| `applied_at` | TIMESTAMPTZ |

---

## Data Sources

| Source | Data provided | Fetch frequency | Series IDs / Notes |
|--------|--------------|-----------------|-------------------|
| FRED | CPI (CPIAUCNS) | Daily (02:00 UTC); 90-day overlap | Not seasonally adjusted; from Jan 1913 |
| FRED | FX rates (EUR, JPY, GBP, CNY) | Daily (02:00 UTC); 14-day overlap | DEXUSEU, DEXJPUS, DEXUSUK, DEXCHUS; from 1971 |
| FRED | M2 money supply | Weekly (Sunday 03:00 UTC) | M2SL monthly → annual averages; from 1959 |
| FRED | Real GDP | Weekly (Sunday 03:00 UTC) | GDPC1 quarterly → annual averages; from 1947 |
| CryptoCompare | BTC/USD daily OHLCV | Daily (02:00 UTC); 90-day overlap | Free API, no key required; from 2010-07-17 |
| Yahoo Finance | Equities + ETFs (adjusted close) | Daily (02:00 UTC) | Requires browser User-Agent header; v8 chart API |
| Friedman & Schwartz | Historical M2 (1913–1958) | Static seed; run once | Academic source; never overwritten |
| BEA Historical | Historical GDP (1913–1946) | Static seed; run once | Academic source; never overwritten |

**FRED API key required.** Free registration at fred.stlouisfed.org. All FRED fetches go to `https://api.stlouisfed.org/fred/series/observations`.

---

## Data Pipeline

```
Daily 02:00 UTC
  ├── fetchCPI.ts     → market_cpi_history
  ├── fetchFX.ts      → market_fx_history
  ├── fetchBTC.ts     → market_price_history (BTC)
  └── fetchEquities.ts → market_price_history (equities + ETFs)

Daily 02:45 UTC
  └── computePPSeries.ts → market_pp_series (rebuilds all windows)
        For each window (1Y, 5Y, 10Y):
          Load M2/GDP monthly series ONCE (shared deflator for all assets)
          THM    → calculateTHM_M2GDP() [primary] or calculateTHM() [fallback]
          USD    → 100 × (M2GDP_start / M2GDP_t)
          EUR/JPY/GBP/CNY → 100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)
          Equities/ETFs/BTC → 100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
          where M2GDP_t = M2_t / GDP_t, linearly interpolated to monthly

Weekly Sunday 03:00 UTC
  └── fetchM2GDP.ts   → market_m2_history + market_gdp_history
```

All jobs are idempotent. All writes use `INSERT ... ON CONFLICT DO UPDATE`. All fetch attempts are logged to `fetch_log`.

---

## API Endpoints

All routes under `/api/`. All responses: `{ success: boolean, data: T, error?: string }`. Dates as ISO strings (`YYYY-MM-DD`).

---

### `GET /api/health`

Monitors all data sources for staleness (threshold: 2 days).

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy" | "degraded" | "initializing",
    "sources": [{ "source": "FRED_CPI", "lastSuccess": "2026-06-02", "status": "ok" }]
  }
}
```
Returns HTTP 503 if status is `degraded`.

---

### `GET /api/series/:ticker?window=10`

Single-ticker purchasing power series. Valid windows: 1, 5, 10.

**Notes:**
- THM is computed on-demand via `calculateTHM(windowStart, today)` (analytical formula, not M2/GDP)
- All other tickers served from `market_pp_series`
- Returns 404 if no data found

**Response:**
```json
{
  "success": true,
  "data": {
    "ticker": "BTC",
    "window": 10,
    "data": [{ "date": "2016-06-01", "value": 100.00 }]
  }
}
```

---

### `GET /api/series/group/:group?window=10&btcAs=currency&view=real`

Multi-ticker group series for dashboard chart panels.

**Parameters:**
- `group`: `currency` | `riskoff` | `riskon`
- `window`: `1` | `5` | `10`
- `btcAs`: `currency` (default) | `riskon` — BTC appears in the requested group only
- `view`: `real` (default, M2/GDP-adjusted) | `nominal` (dollar-denominated; USD omitted)

**Response:**
```json
{
  "success": true,
  "data": {
    "group": "currency",
    "window": 10,
    "btcAs": "currency",
    "view": "real",
    "series": {
      "THM": [{ "date": "2016-06-01", "value": 100.00 }],
      "USD": [{ "date": "2016-06-01", "value": 100.00 }]
    }
  }
}
```

---

### `GET /api/instruments`

Full instrument registry.

**Response:**
```json
{
  "success": true,
  "data": [{ "ticker": "BTC", "name": "Bitcoin", "group_name": "currency", "data_source": "CryptoCompare", "frequency": "daily", "notes": null }]
}
```

---

### `GET /api/learn/thm-charts`

Full 1913–present THM variant analysis for the `/lens/thm` research charts. No parameters.

**Response:**
```json
{
  "success": true,
  "data": {
    "thm_variants": [{ "year": 1913, "thm_cpi": 100, "thm_m2gdp": 100, "thm_m2raw": 100 }],
    "gap_series": [{ "year": 1913, "m2_index": 100, "gdp_index": 100, "ratio_index": 100 }],
    "chart4": [{ "year": 1913, "stolen": 1.0 }]
  }
}
```

**Formulas:**
- `thm_cpi(y)` = `100 × CPI_y / CPI_1913`
- `thm_m2gdp(y)` = `100 × (M2_y / GDP_y) / (M2_1913 / GDP_1913)`
- `thm_m2raw(y)` = `100 × M2_y / M2_1913`
- `stolen(y)` = `thm_m2raw(y) / thm_m2gdp(y)` — how much faster M2 grew than output required

---

## THM Calculation — Detail

### Dashboard THM (primary)

File: `server/lib/thm-m2gdp.ts`

Function: `calculateTHM_M2GDP(windowStart: Date, endDate: Date): Promise<THMPoint[]>`

1. Loads all rows from `market_m2_history` and `market_gdp_history`
2. Computes annual M2/GDP ratio for each year both series overlap
3. Finds the base ratio at `windowStart` year via linear interpolation
4. Linearly interpolates annual ratios to monthly points (1st of each month)
5. Indexes all points to 100 at `windowStart`
6. Formula per point: `100 × (M2_t / GDP_t) / (M2_start / GDP_start)`

Called by `computePPSeries.ts`. On failure (e.g., no M2/GDP data in DB), falls back to analytical formula.

### Analytical fallback

File: `server/lib/thm.ts`

Function: `calculateTHM(startDate: Date, endDate: Date): THMPoint[]`

Formula: `THM(t) = 100 × (1.02)^years_elapsed`

This formula is the original implementation and remains in the codebase as a fallback. It is **not** the primary dashboard definition. Also used by `GET /api/series/THM` (single-ticker endpoint) — note that this endpoint is not currently called by the frontend for dashboard panels, which use the group endpoint.

### THM Variants (for `/lens/thm` research charts)

File: `server/lib/thm-variants.ts`

Function: `calculateTHMVariants()`

Returns all three indexes from 1913 to present, using the actual DB data. All three are indexed to 100 at 1913. No interpolation — annual points only, forward-filled where sparse.

---

## Purchasing Power Formulas

All implemented in `server/lib/purchasing-power.ts`. All outputs indexed to 100 at `windowStart`.

`M2GDP_t = M2_t / GDP_t`, linearly interpolated to monthly — loaded once per window in `computePPSeries.ts` and shared across all 17 asset series. Same series as used for THM, ensuring USD × THM = 100² at every point.

| Series | Formula |
|--------|---------|
| USD | `100 × (M2GDP_start / M2GDP_t)` |
| EUR, JPY, GBP, CNY | `100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)` |
| Equities, ETFs, BTC | `100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)` |
| Nominal currency | `100 × (FX_start / FX_t)` (unchanged) |
| Nominal equity | `100 × (price_t / price_start)` (unchanged) |

CPI (FRED CPIAUCNS) is retained in `market_cpi_history` and continues to be fetched daily. It is used only for the `thm_cpi` variant in the three-method comparison charts on `/lens/thm`. It is not used as the primary purchasing power deflator for dashboard assets.

FX rates are stored as **units of foreign currency per 1 USD**. Rising rate = foreign currency weakening vs USD. EUR and GBP are inverted at fetch time to match this convention.

---

## Client Architecture

### Data flow

1. Component mounts → hook called (`useSeriesData` or `useTHMChartData`)
2. Hook fetches from Express API via `fetch()`
3. Response merged into flat Recharts-compatible `ChartDataPoint[]` (date as string key, ticker values as number keys)
4. Recharts `LineChart` renders; THM line always rendered first (dashed green, always visible)
5. User can toggle individual series visibility via legend click

### Chart indexing

All values in `market_pp_series` are indexed to 100 at the window start. The frontend displays raw values — 100 is the reference line, not 0. Values above 100 = gained value; below 100 = lost value. The `ReferenceLine y={100}` in ChartPanel marks the baseline.

### BTC toggle

The `btcAs` state (stored in component state, not localStorage) controls whether BTC is included in the `currency` or `riskon` group query. Only the active group fetches BTC. This is a client-side classification — the API supports both via the `btcAs` query parameter.

### Color system

`SERIES_COLORS` in `client/src/types/index.ts` defines fixed hex colors for every ticker. THM is always `#a8ff78` (lime green, dashed). BTC is always `#f7931a` (orange). Colors never change regardless of panel.

---

## Deployment

The codebase is configured for Railway deployment with Cloudflare in front.

### Production environment

- **Host:** Railway
- **Build command (root):** `npm run build`
  - Server: `tsc` compiles TypeScript; post-step copies `db/migrations/*.sql` into `dist/db/migrations/` (tsc only outputs `.js`, not `.sql`)
  - Client: `tsc` type-check → `vite build` (SPA bundle) → `vite build --ssr` (SSR bundle to `dist-ssr/`) → `node scripts/prerender.js` (writes prerendered HTML, deletes `dist-ssr/`)
- **Start command:** `node server/dist/db/migrate.js && node server/dist/index.js`
  - Migrations run automatically at every startup (idempotent; SQL files are in `dist/db/migrations/` after build)
  - Server then starts on PORT (Railway injects)
- **Static files:** Express serves `client/dist` in production (`NODE_ENV=production`). The catch-all checks for `dist/[req.path]/index.html` before falling back to `dist/index.html` — prerendered pages are served directly without a redirect.
- **DNS/CDN:** Cloudflare in front of Railway

### Environments

- **Production:** `freemarketwatch.world` — Railway production environment
- **Staging:** Separate Railway service (URL used in CORS allowlist: checked against `staging` string match)
- **Development:** `localhost:5173` (Vite dev server) + `localhost:3333` (Express) — proxied via Vite config

### Environment variables

Set in Railway Variables tab for each environment. Never stored in the repository. The `.env` file is gitignored.

### Auto-deploy

Per Railway defaults: pushes to the connected branch trigger automatic deploy. Confirm branch configuration in Railway dashboard before pushing.

---

## Scripts Reference

| Command | What it does |
|---------|-------------|
| `npm run build` (root) | Builds server TypeScript + client Vite bundle |
| `npm run start` (root) | Runs migrations then starts server (production) |
| `npm run dev` (server/) | tsx watch — hot-reload server in development |
| `npm run db:migrate` (server/) | Applies pending SQL migrations |
| `npm run db:seed-thm` (server/) | Seeds pre-FRED M2/GDP historical data (run once) |
| `npm run jobs:fetch-cpi` (server/) | Fetch CPI from FRED (incremental) |
| `npm run jobs:fetch-cpi-full` (server/) | Fetch full CPI history from 1913 |
| `npm run jobs:fetch-fx` (server/) | Fetch FX rates from FRED |
| `npm run jobs:fetch-btc` (server/) | Fetch BTC price history |
| `npm run jobs:fetch-equities` (server/) | Fetch equity/ETF prices from Yahoo Finance |
| `npm run jobs:fetch-m2gdp` (server/) | Fetch M2 + GDP from FRED |
| `npm run jobs:compute-pp` (server/) | Rebuild entire market_pp_series table |

**New database setup order:**
1. Set `DATABASE_URL` in `.env`
2. `npm run db:migrate` — creates all tables
3. `npm run db:seed-thm` — seeds 1913–1958 M2 and 1913–1946 GDP
4. `npm run jobs:fetch-cpi-full` — full CPI history from 1913
5. `npm run jobs:fetch-fx` — FX history from 1971
6. `npm run jobs:fetch-btc` — BTC history from 2010
7. `npm run jobs:fetch-equities` — 10 years of equity data
8. `npm run jobs:fetch-m2gdp` — M2 and GDP from FRED
9. `npm run jobs:compute-pp` — build purchasing power series

---

*FreeMarketWatch · June 2026*
*Companion documents: FMW_Vision.md, FMW_Content.md, CLAUDE.md*
