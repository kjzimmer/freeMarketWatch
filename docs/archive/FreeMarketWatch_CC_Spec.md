# FreeMarketWatch — Claude Code Build Specification
*For handoff to Claude Code (CC). Read fully before writing any code.*

---

## 1. Project Philosophy

FreeMarketWatch is a consumer-facing economics education and data dashboard. Its central premise:

> **Purchasing power is the only honest benchmark.** Not the dollar, not Bitcoin, not gold. The question for any asset, currency, or good is simply: does it maintain, gain, or lose purchasing power over time?

The site has two audiences:
- **The aware** — people who understand markets and want to see reality unfiltered by fiat framing
- **The unaware** — people who don't yet understand what money is, why debasement matters, or what hard money changes

The data presentation serves the first audience now. An education track (separate scope, future phase) will serve the second.

**This is not a Bitcoin site.** Bitcoin appears as one data series among many. The hero of the site is honest purchasing power measurement — whatever maintains it best wins.

---

## 2. Core Concept: The Three Series That Matter

Every chart plots instruments indexed to 100 at the start of the selected time window. Three special series appear on every chart:

### THM — Theoretical Hard Money
A synthetic benchmark. Defined as:
- Anchored conceptually to 1913 (pre-Federal Reserve, last year of relatively stable US purchasing power)
- Appreciates at **+2% per year** in real purchasing power terms
- The 2% represents the natural productivity-driven deflation of a sound economy (goods get cheaper as production improves — as seen historically in electronics, food, manufacturing)
- Calculated as: `THM(t) = 100 × (1.02)^(years_elapsed)`
- This is a straight upward slope — no volatility, no market noise
- **Displayed as a dashed line** on all charts — the benchmark everything is measured against
- Anything above THM = gaining real purchasing power. Anything below = losing it.
- Write-up explaining the 2% figure and its theoretical basis must be available via drill-down

### USD — US Dollar (CPI-deflated)
- Source: FRED CPI series (CPIAUCSL)
- Represents the actual purchasing power loss of holding dollars
- Calculated as: `USD(t) = 100 × (CPI_start / CPI_t)`
- Will slope downward — approximately -3% to -5%/year over recent decades
- This IS the purchasing power line for dollars. It is not a forex rate.

### BTC — Bitcoin
- Source: CoinGecko or CryptoCompare (free tier)
- Priced in USD, then adjusted by CPI to get real purchasing power terms
- No data before January 2009 (genesis block). Charts that include BTC must handle this gracefully — BTC line simply begins when data exists within the selected window
- BTC has an **adoption curve** layered on top of its hard money properties — this makes it more volatile and more steeply appreciating than THM. This is by design and is part of the educational message.
- **BTC classification toggle**: User can classify BTC as either a Currency or a Risk-On asset. This changes which panel it appears in. Default: Currency. The toggle is a philosophical framing choice — both are defensible — and is itself educational.

---

## 3. Instrument Groups

### Panel 1: World Currencies
Top 5 currencies by global reserve share + THM + USD + optionally BTC (if toggle = Currency)

| Ticker | Instrument | Data Source |
|--------|-----------|-------------|
| THM | Theoretical Hard Money | Calculated |
| USD | US Dollar | FRED CPIAUCSL |
| EUR | Euro | FRED or ECB |
| JPY | Japanese Yen | FRED or BOJ |
| GBP | British Pound | FRED or BOE |
| CNY | Chinese Yuan | FRED |
| BTC | Bitcoin (optional) | CoinGecko |

**Calculation for non-USD currencies:**
`Currency_PP(t) = 100 × (FX_rate_start / FX_rate_t) × (CPI_start / CPI_t)`
i.e., exchange rate movement × US CPI adjustment = purchasing power relative to THM baseline

### Panel 2: Risk-Off Assets
Traditional safe-haven instruments. Do they actually preserve purchasing power?

| Ticker | Instrument | Data Source |
|--------|-----------|-------------|
| THM | Theoretical Hard Money | Calculated |
| TLT | US 20yr Treasuries | Yahoo Finance / Alpha Vantage |
| GLD | Gold ETF (or spot XAU/USD) | Yahoo Finance / metals-api.com |
| TIPS | US TIPS ETF | Yahoo Finance |
| MM | Money Market (3mo T-bill proxy) | FRED TB3MS |
| CASH | Cash/Savings (savings rate proxy) | FRED |

### Panel 3: Risk-On Assets (Mag 7)
The most productive public equities. Which ones outrun hard money?

| Ticker | Instrument | Data Source |
|--------|-----------|-------------|
| THM | Theoretical Hard Money | Calculated |
| AAPL | Apple | Yahoo Finance |
| MSFT | Microsoft | Yahoo Finance |
| GOOGL | Alphabet | Yahoo Finance |
| AMZN | Amazon | Yahoo Finance |
| NVDA | NVIDIA | Yahoo Finance |
| META | Meta | Yahoo Finance |
| TSLA | Tesla | Yahoo Finance |
| BTC | Bitcoin (optional) | CoinGecko (if toggle = Risk-On) |

**Scale note:** NVDA and BTC can dominate charts due to extreme outperformance. Implement a **log scale toggle** on each panel. Default: linear. Log scale option always available.

---

## 4. Data Architecture

### 4.0 Schema Design Philosophy

Design the database with multi-feature extensibility in mind. Future additions that must not be painted into corners by early schema decisions:

- **User authentication** — registered users, sessions, preferences (BTC classification toggle persisted server-side, instrument selections)
- **Blog / community** — posts, comments, moderation, contributor roles
- **Proprietary index series** — BTC adoption indexes across three dimensions: Store of Value (SOV), Medium of Exchange (MOE), and Unit of Account (UOA). These will be computed series stored similarly to `pp_series` but potentially monetized via access tiers
- **Access tiers** — some content or indexes may be behind a subscription wall; schema should accommodate free vs. paid vs. institutional access from the start

Use generic, non-colliding table naming. Avoid assumptions that `instruments` only ever means market-price instruments — future index series are also instruments of a kind. Prefer clear namespacing (e.g. `market_*`, `user_*`, `blog_*`, `index_*`) over flat table names when ambiguity could arise.

### 4.1 Postgres Schema

```sql
-- Master instrument registry
CREATE TABLE instruments (
  id            SERIAL PRIMARY KEY,
  ticker        VARCHAR(10) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  group_name    VARCHAR(20) NOT NULL,  -- 'currency', 'riskoff', 'riskon'
  data_source   VARCHAR(50),
  frequency     VARCHAR(10),           -- 'daily', 'monthly'
  notes         TEXT
);

-- Raw price/rate data as received from APIs
CREATE TABLE price_history (
  id            BIGSERIAL PRIMARY KEY,
  ticker        VARCHAR(10) NOT NULL REFERENCES instruments(ticker),
  date          DATE NOT NULL,
  value         NUMERIC(20, 8) NOT NULL,
  currency      VARCHAR(5) DEFAULT 'USD',
  source        VARCHAR(50),
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticker, date)
);

-- CPI data (separate because it's used as deflator for everything)
CREATE TABLE cpi_history (
  id            SERIAL PRIMARY KEY,
  date          DATE NOT NULL UNIQUE,
  cpi_value     NUMERIC(10, 4) NOT NULL,
  source        VARCHAR(50) DEFAULT 'FRED_CPIAUCSL',
  fetched_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Exchange rates vs USD (for currency panel calculations)
CREATE TABLE fx_history (
  id            SERIAL PRIMARY KEY,
  currency_code VARCHAR(5) NOT NULL,
  date          DATE NOT NULL,
  rate_vs_usd   NUMERIC(16, 8) NOT NULL,  -- units of currency per 1 USD
  source        VARCHAR(50),
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(currency_code, date)
);

-- API fetch log (track what was fetched when, for rate limit management)
CREATE TABLE fetch_log (
  id            SERIAL PRIMARY KEY,
  source        VARCHAR(50) NOT NULL,
  endpoint      VARCHAR(200),
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  records_added INT,
  success       BOOLEAN,
  error_msg     TEXT
);

-- Computed purchasing power series (cached calculations)
-- Rebuilt on demand or on schedule, avoids recomputing on every request
CREATE TABLE pp_series (
  id            SERIAL PRIMARY KEY,
  ticker        VARCHAR(10) NOT NULL,
  date          DATE NOT NULL,
  pp_index      NUMERIC(16, 6),   -- purchasing power index vs THM baseline
  window_years  INT NOT NULL,     -- 1, 5, or 10
  computed_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ticker, date, window_years)
);
```

### 4.2 Data Flow

```
External APIs
     │
     ▼
[Fetch Jobs] ──► price_history / cpi_history / fx_history
                              │
                              ▼
                    [Calculation Jobs] ──► pp_series
                                               │
                                               ▼
                                       [React Frontend]
                                    (reads pp_series only)
```

Static historical data is fetched once and stored. Only recent/live data is re-fetched on schedule. This avoids hammering free API rate limits.

---

## 5. API Sources

### 5.1 FRED (Federal Reserve Economic Data)
- **URL:** `https://api.stlouisfed.org/fred/series/observations`
- **Auth:** Free API key from fred.stlouisfed.org
- **Rate limit:** 120 requests/minute (generous)
- **Key series:**
  - `CPIAUCSL` — Consumer Price Index, monthly, back to 1913
  - `TB3MS` — 3-month T-bill rate (money market proxy)
  - `DEXUSEU`, `DEXUSUK`, `DEXJPUS`, `DEXCHUS` — daily FX rates
- **Fetch strategy:** Full history once on setup, then monthly updates for CPI, daily for FX

```javascript
// Example FRED fetch
const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json&observation_start=1913-01-01`;
```

### 5.2 CoinGecko (Bitcoin)
- **URL:** `https://api.coingecko.com/api/v3`
- **Auth:** Free tier available, no key required for basic endpoints
- **Rate limit:** 10-30 calls/minute on free tier
- **Key endpoints:**
  - `/coins/bitcoin/market_chart?vs_currency=usd&days=max` — full BTC price history
  - `/simple/price?ids=bitcoin&vs_currencies=usd` — current price
- **Fetch strategy:** Full history once (returns daily OHLC), then daily updates
- **Note:** Free tier has limitations on granularity beyond 90 days. Store everything received.

```javascript
// Full BTC history
const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max&interval=daily`;
```

### 5.3 Yahoo Finance (Equities & ETFs)
- **Library:** `yahoo-finance2` npm package (unofficial but reliable)
- **Auth:** None required
- **Rate limit:** Unofficial — be conservative, 1 request/second recommended
- **Key calls:**
  - `yahooFinance.historical(ticker, { period1, period2 })` — daily OHLC
  - Tickers: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, TLT, GLD, TIPS
- **Fetch strategy:** 10 years of history on setup, then daily updates

```javascript
import yahooFinance from 'yahoo-finance2';
const data = await yahooFinance.historical('AAPL', {
  period1: '2014-01-01',
  period2: new Date().toISOString().split('T')[0],
  interval: '1d'
});
```

### 5.4 ECB / Central Banks (Backup FX source)
- **ECB API:** `https://data-api.ecb.europa.eu/service/data/EXR/` — free, no key
- Use as backup/validation for FRED FX data
- Particularly useful for EUR/USD official rates

### 5.5 Metals API (Gold spot price backup)
- **URL:** `https://metals-api.com` or `https://api.metals.live`
- Free tiers available for spot gold (XAU/USD)
- Use as validation against GLD ETF price

---

## 6. THM Calculation

THM is not fetched from any API. It is computed.

```typescript
// THM purchasing power index
// Base: 100 at any selected window start date
// Growth: +2% per year, compounded

function calculateTHM(startDate: Date, endDate: Date): { date: Date, value: number }[] {
  const points = [];
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  
  // Generate monthly points
  let current = new Date(startDate);
  while (current <= endDate) {
    const yearsElapsed = (current.getTime() - startDate.getTime()) / msPerYear;
    const value = 100 * Math.pow(1.02, yearsElapsed);
    points.push({ date: new Date(current), value });
    current.setMonth(current.getMonth() + 1);
  }
  return points;
}
```

**On the 2% figure:**
The 2% annual appreciation represents the long-run productivity growth rate of a healthy economy. In a non-debased monetary system, productivity improvements flow through to consumers as lower prices (deflation). Historical examples: pre-Fed US economy (1870-1913), electronics sector (consistent 20-40%/yr price decline), agricultural productivity. The 2% is a conservative, defensible estimate. This figure and its theoretical basis should be documented in the methodology drill-down. It is likely to be a subject of ongoing refinement.

---

## 7. Purchasing Power Calculation

All instruments are converted to a purchasing-power index for display.

### For USD:
```typescript
// USD PP index: real purchasing power of a dollar over time
function usdPurchasingPower(cpiData: CpiPoint[], windowStart: Date): IndexPoint[] {
  const startCPI = interpolateCPI(cpiData, windowStart);
  return cpiData
    .filter(d => d.date >= windowStart)
    .map(d => ({
      date: d.date,
      value: 100 * (startCPI / d.cpi_value)  // inverted: higher CPI = lower PP
    }));
}
```

### For other fiat currencies (EUR, JPY, GBP, CNY):
```typescript
// Currency PP = exchange rate change × USD CPI adjustment
function currencyPurchasingPower(
  fxData: FxPoint[],      // rate vs USD over time
  cpiData: CpiPoint[],    // US CPI
  windowStart: Date
): IndexPoint[] {
  const startFX = interpolateFX(fxData, windowStart);
  const startCPI = interpolateCPI(cpiData, windowStart);
  
  return fxData
    .filter(d => d.date >= windowStart)
    .map(d => {
      const cpi = interpolateCPI(cpiData, d.date);
      // FX: units of foreign currency per USD. Lower = foreign currency stronger.
      const fxChange = startFX / d.rate;         // foreign currency appreciation vs USD
      const cpiAdjust = startCPI / cpi;          // USD purchasing power change
      return {
        date: d.date,
        value: 100 * fxChange * cpiAdjust
      };
    });
}
```

### For equities and ETFs:
```typescript
// Equity PP = price change adjusted for CPI (real return)
function equityPurchasingPower(
  priceData: PricePoint[],
  cpiData: CpiPoint[],
  windowStart: Date
): IndexPoint[] {
  const startPrice = interpolatePrice(priceData, windowStart);
  const startCPI = interpolateCPI(cpiData, windowStart);
  
  return priceData
    .filter(d => d.date >= windowStart)
    .map(d => {
      const cpi = interpolateCPI(cpiData, d.date);
      const nominalReturn = d.price / startPrice;
      const realReturn = nominalReturn * (startCPI / cpi);
      return { date: d.date, value: 100 * realReturn };
    });
}
```

### For BTC:
Same as equity calculation but:
- Data begins 2009-01-03 (genesis block)
- For windows that predate BTC, the BTC line simply begins when data is available
- BTC is priced in USD then CPI-adjusted — same formula as equities

---

## 8. Backend API Endpoints (Express/Node)

The React frontend talks to a local Express API that reads from Postgres.

```
GET /api/series/:ticker?window=10
  → Returns pp_series data for given ticker and year window
  → Response: { ticker, window, data: [{date, pp_index}] }

GET /api/series/group/:group?window=10&btcAs=currency
  → Returns all series for a panel group
  → btcAs: 'currency' | 'riskon' — controls BTC panel assignment
  → Response: { group, window, series: { TICKER: [{date, pp_index}] } }

GET /api/instruments
  → Returns instrument registry

GET /api/thm?window=10
  → Returns calculated THM series for the window

POST /api/admin/fetch/:source
  → Triggers a manual data fetch for a given source (admin only)

GET /api/health
  → Returns data freshness status for all sources
```

---

## 9. Frontend Architecture

### Tech stack
- React + TypeScript
- Recharts for charting
- Postgres ← Express API ← React

### Key components
```
App
├── Header (timeframe selector, BTC toggle)
├── THMExplainer (collapsible banner)
├── ChartPanel (× 3)
│   ├── LineChart (Recharts)
│   ├── LogScaleToggle
│   ├── EndpointSummary (sorted list of final values)
│   └── DrillDownModal
│       ├── MethodologyText
│       ├── DataSourceList
│       └── CalculationDetail
└── Footer
```

### BTC toggle state
```typescript
type BTCClassification = 'currency' | 'riskon';

// Stored in localStorage for persistence
const [btcAs, setBtcAs] = useState<BTCClassification>('currency');
```

The toggle should be prominent — not buried in settings. It's a philosophical choice and a teaching moment. Label it clearly:
> "Treat Bitcoin as: [ Currency ] [ Risk-On Asset ]"
> *"This reflects two schools of thought — see methodology"*

### Chart behavior
- All series indexed to 100 at left edge of selected time window
- THM always rendered as dashed line, slightly thicker, lime green
- Reference line at y=100 (start of period baseline)
- Log scale toggle per panel (especially important for panels with BTC or NVDA)
- Clicking any series in legend toggles its visibility
- Clicking chart area (or a "details" button) opens DrillDownModal

### Timeframe selector
- 1Y, 5Y, 10Y
- Stored in app state, applies to all panels simultaneously
- BTC panel note: on 10Y, BTC only has data from ~2014 for a clean 10Y. Handle gracefully.

---

## 10. Data Collection Jobs

Run as Node.js cron jobs (use `node-cron` or similar).

```
Job 1: fetch-cpi          — Monthly, 1st of month
  Source: FRED CPIAUCSL
  Action: Fetch last 3 months, upsert to cpi_history
  Also: On first run, fetch full history back to 1913

Job 2: fetch-fx           — Daily, 6am UTC
  Source: FRED FX series (DEXUSEU, DEXJPUS, DEXUSUK, DEXCHUS)
  Action: Fetch last 7 days, upsert to fx_history

Job 3: fetch-btc          — Daily, 6am UTC
  Source: CoinGecko
  Action: Fetch last 7 days daily prices, upsert to price_history
  Also: On first run, fetch full history (max days)

Job 4: fetch-equities     — Daily, 7am UTC (after market close)
  Source: yahoo-finance2
  Action: Fetch previous trading day for all equity/ETF tickers
  Also: On first run, fetch 10 years of history

Job 5: compute-pp-series  — Daily, 8am UTC (after all fetches complete)
  Action: Recompute pp_series for all tickers × all windows (1, 5, 10)
  Stores results in pp_series table for fast frontend reads

Job 6: health-check       — Hourly
  Action: Verify data freshness, log alerts if any source is stale > 2 days
```

---

## 11. Phased Build Plan

### Phase 1 — Backend foundation (start here)
1. Postgres schema setup (Section 4.1)
2. FRED integration: fetch CPI back to 1913, store in `cpi_history`
3. FRED FX rates: EUR, JPY, GBP, CNY — full history
4. CoinGecko: BTC full price history
5. Yahoo Finance: all equity/ETF tickers, 10 years
6. THM calculation function
7. Purchasing power calculation functions (Section 7)
8. `pp_series` computation job
9. Express API endpoints (Section 8)

### Phase 2 — Frontend integration
1. Wire existing React prototype to real API
2. Replace fake data generators with API calls
3. BTC classification toggle (prominent, educational)
4. Log scale toggle per panel
5. Legend click to show/hide series
6. DrillDownModal with real methodology text

### Phase 3 — Design polish
1. Apply frontend design skill for production aesthetic
2. Responsive layout (mobile, tablet, desktop)
3. Loading states and error handling
4. Data freshness indicator

### Phase 4 — Education component (separate scoping conversation)
- Placeholder routes exist from Phase 2
- Full content and UX to be designed separately

---

## 12. Environment Variables Needed

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/freemarketwatch
FRED_API_KEY=your_fred_api_key        # free at fred.stlouisfed.org
COINGECKO_API_KEY=                    # optional, improves rate limits
PORT=3001
NODE_ENV=development
```

---

## 13. Open Questions / Future Considerations

- **THM 2% figure**: Theoretical basis needs a written defense. Subject to revision.
- **CPI as deflator**: CPI is an imperfect measure of purchasing power. Future versions may use alternative deflators (PCE, commodity basket, shadow stats). This is a known limitation and should be disclosed.
- **Sector CPI breakout** (housing, education, fuel, food): Interesting but requires theoretical disclaimer — historical sector behavior under fiat does not reflect what those sectors would look like under hard money. Housing especially: its inflation-hedge premium would not exist in a hard money world.
- **Dollar as intermediary**: All calculations currently route through USD. Watch for data sources that allow direct BTC-denominated pricing of assets, eliminating the dollar as intermediary.
- **BTC sampling frequency**: BTC moves faster than monthly CPI or quarterly earnings. Consider weekly or daily pp_series for BTC vs monthly for others.
- **Instrument selectability**: Currently hardcoded. Future: user can add/remove instruments from each panel.
- **Fiat perspective toggle**: Show same data from a fiat (nominal) perspective to demonstrate how fiat framing distorts understanding. Deferred — build purchasing power view first.
- **BTC as best-ever hard money**: The site will make an affirmative case for BTC as the strongest hard money in human history. This is to be done through honest data presentation, not editorializing — the data makes the case. Framing should preserve site credibility: "we don't advocate, the data speaks." Editorial philosophy TBD.
- **BTC Adoption Indexes (SOV / MOE / UOA)**: Proprietary indexes measuring BTC adoption across three dimensions — Store of Value (long-term holder behavior, institutional custody), Medium of Exchange (transaction volume, Lightning Network, merchant adoption), and Unit of Account (assets priced natively in BTC). Distinct from existing sentiment indexes (Fear & Greed, MVRV). Potential monetization via institutional/research subscriptions. Needs dedicated scoping conversation. Schema must accommodate computed proprietary series with access-tier gating.
- **Blog with authenticated participation**: Posts, comments, contributor roles, moderation. Editorial philosophy (open community vs. curated contributors) to be decided before build. Auth layer and blog schema should be designed together.
- **Monetization layer**: Access tiers (free / paid / institutional) anticipated. Design user and subscription schema to accommodate this from the start even if not activated in early phases.

---

*Document version: 1.0 — May 2026*
*Prepared for Claude Code handoff*
