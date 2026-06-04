# FreeMarketWatch — Vision and Purpose
## June 2026

---

## What this site is

FreeMarketWatch is a financial data dashboard and economics education site built around one premise: **purchasing power is the only honest way to measure a currency or asset**. Everything else — nominal prices, dollar returns, percentage gains — measures distance with a ruler that shrinks a little every year.

The site shows what financial markets look like when you replace the dollar with an honest benchmark. Not gold. Not Bitcoin. A synthetic benchmark called THM — Theoretical Hard Money — that represents what money would look like if the monetary system had been honest since 1913. Against that ruler, the picture of which assets genuinely preserve value changes dramatically.

---

## The founding premise

FreeMarketWatch is built on two premises.

**First:** purchasing power is the only honest lens for understanding any currency or asset. Nominal prices, dollar returns, percentage gains — all measure distance with a ruler that shrinks a little every year. The only question that matters is: does this asset let you buy more or less over time?

**Second:** THM — Theoretical Hard Money — represents what Bitcoin would look like as a mature monetary standard, with the adoption phase factored out. Bitcoin has the right monetary properties: fixed supply, no controlling authority, no political convenience. But it is in an adoption phase that makes its current price reflect speculation as much as monetary properties. THM is the best estimate of where Bitcoin arrives when that adoption is complete — the end state, not the transition.

Against that benchmark, the picture of which assets genuinely preserve value changes dramatically from what standard financial analysis shows.

Standard financial analysis takes the dollar for granted as a neutral unit of measurement. It is not neutral. The Federal Reserve creates more dollars every year than the growing economy requires. The excess — what the site calls monetary debasement — dilutes the purchasing power of every existing dollar. When you measure assets against a currency that shrinks, you see a distorted picture: assets appear to gain value when they are merely keeping pace with debasement; currencies appear stable when they are quietly failing at their only job.

This distortion is not incidental. It is the central, least-discussed fact in finance.

FreeMarketWatch addresses it with a single change: replace the dollar with THM as the benchmark. Everything above the THM line is genuinely gaining purchasing power. Everything below it is losing ground, regardless of what the dollar price shows.

---

## THM — The Benchmark

### What it is

THM (Theoretical Hard Money) is a synthetic purchasing power index. It is not a real asset, not a price, and not fetched from any external source. It is computed from historical data to represent what an honest monetary system would look like: one in which the money supply is fixed — cannot be expanded by any authority — so that productivity gains in the real economy flow through as gradually falling prices, increasing the purchasing power of every unit of money held.

Bitcoin embodies this ideal: provably fixed supply of 21 million, no controlling authority, issuance governed by mathematics not policy. THM represents what Bitcoin looks like as a mature monetary standard — the destination, with the adoption phase factored out.

We calculate THM using M2/GDP — the ratio of money supply growth above real economic output. This is an approximation of the fixed supply ideal: M2/GDP measures how much faster the money supply grew than the economy required, and the inverse of that excess is what purchasing power would have looked like under a fixed supply. Rather than assume a deflation rate, we derive it from 111 years of real data. The full methodology is in The Lens.

### What is currently implemented

The dashboard THM line is calculated using the **M2/GDP ratio** — the ratio of broad money supply to real economic output. When M2 grows faster than GDP, the excess represents pure monetary debasement. THM tracks the cumulative growth of this excess, indexed to 100 at the chart window start.

**Formula:** `THM(t) = 100 × (M2_t / GDP_t) / (M2_start / GDP_start)`

**All dashboard assets are deflated using the same M2/GDP series.** This makes the benchmark and the deflator theoretically consistent — THM and USD purchasing power are exact mathematical inverses (USD × THM = 100² at every point). CPI is retained in the database and continues to be fetched, but is used only for the THM_CPI variant in the three-method comparison on /lens/thm. CPI is no longer the primary deflator for dashboard assets.

Data sources used in the calculation:
- **M2:** FRED M2SL (monthly, 1959–present) averaged to annual; Friedman & Schwartz historical data (1913–1958)
- **Real GDP:** FRED GDPC1 (quarterly, 1947–present) averaged to annual; BEA historical estimates (1913–1946)
- Annual M2/GDP ratios are linearly interpolated to monthly points for the 1Y/5Y/10Y dashboard windows

### What this means for the chart

The THM line rises steeply over time — reflecting the scale of accumulated debasement since 1913. At the 10-year window, the line's slope represents how much faster money supply grew than the economy over that period. For a currency or asset to genuinely preserve purchasing power, it must stay above this line.

### The analytical fallback

The original THM formula — `100 × (1.02)^years_elapsed` — still exists in the codebase as a fallback (`server/lib/thm.ts`). It is used only if M2/GDP data is unavailable at computation time. The 2% annual growth figure is no longer the primary dashboard definition.

### The three-method comparison

The `/lens/thm` page shows the full 1913–present history under three approaches:
- **THM_CPI**: `100 × (CPI_t / CPI_1913)` — measures monetary debasement via consumer prices
- **THM_M2GDP**: `100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)` — measures excess money creation (the preferred measure, used on the dashboard)
- **THM_M2RAW**: `100 × (M2_t / M2_1913)` — measures raw money supply growth without GDP adjustment

The methodology page explains why M2/GDP is the preferred measure and what the open questions are.

---

## What the site shows

The dashboard is structured around three panels of assets, all measured against THM:

**World Currencies** — Major fiat currencies (USD, EUR, JPY, GBP, CNY) and Bitcoin measured against THM. Shows which currencies preserved purchasing power and which failed. Bitcoin can be reclassified to the Risk-On panel via a toggle.

**Risk-Off Assets** — Instruments traditionally considered safe: gold (GLD), long-duration US Treasuries (TLT), and inflation-linked bonds (TIPS). Shows whether traditional safe-haven assets actually protect purchasing power against THM over time.

**Risk-On / Mag 7** — The seven largest US technology companies (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA) and Bitcoin. Shows which, if any, genuinely outpace monetary debasement — and which merely appear to because performance is measured in shrinking dollars.

All panels offer 1-year, 5-year, and 10-year windows. The 10-year view is where the real story becomes visible.

---

## The Lens — The intellectual foundation

The Lens is a three-component section that builds the intellectual case for the site's approach. It answers: why use THM instead of dollars? Why does the choice of benchmark matter?

### Component 1: Why the Fiat Lens Distorts (`/lens/fiat`)
**Status: Live**

A six-act education series taking the reader from the origin of money to the case for Bitcoin, built entirely from first principles. Acts cover: why money exists, what makes good money, how fiat debasement works, the knock-on effects of bad money, the hard money alternative, and what Bitcoin is and why it matters. Each act links to the next. A downloads section provides PDFs and presentation decks.

### Component 2: The THM Lens (`/lens/thm`)
**Status: Live**

The full THM methodology discussion, including: the three possible definitions of THM and the argument for M2/GDP; the eurodollar problem (offshore dollar creation); the gap between what M2/GDP measures and what raw M2 measures; and honest acknowledgment of what remains unresolved. Four research charts visualize the full 1913–present history.

### Component 3: Investing Through the THM Lens (`/lens/investing`)
**Status: Live as framework; investing tools not yet built**

The theoretical framework for how investment analysis changes when hard money is the base position rather than a forced choice. Covers: the shift in base-position logic, what genuine value creation looks like vs. fiat tailwinds, how debt looks different under hard money, time horizon effects, and the information a THM investor actually needs. The page explicitly notes that dashboard tools for THM-based investment analysis are work in progress.

---

## What is deferred or not yet built

The following features are briefed or referenced but not yet implemented:

**Dashboard THM toggle** — A planned feature to let users switch the dashboard THM benchmark between CPI, M2/GDP, and M2RAW definitions. Not yet built; the dashboard currently uses M2/GDP only.

**Additional instruments** — The schema supports adding more currencies, commodities, and asset classes. Only the currently listed instruments are populated.

**MM / Cash data** — The Money Market (MM) instrument appears in the instrument registry and in DrillDownModal notes as "data pending." The series logic requires additional conversion from rate data to a price index. Not yet built.

**Component 3 investing tools** — The investing framework text is live; the dashboard tools it describes (real revenue growth screens, debt burden analysis, productivity screens) are explicitly marked as work in progress on the page itself.

**Download files** — The `/lens/fiat` page links to PDF and PPTX downloads. Whether those files exist in `client/public/downloads/` has not been verified.

---

## The Bitcoin framing

The connection between THM and Bitcoin is not metaphorical. Both are defined by a fixed supply that no authority can expand. Bitcoin's 21 million cap is enforced by mathematics running on thousands of independent nodes. THM's fixed supply is the defining assumption of the benchmark. In both cases, the consequence is the same: purchasing power can only change through real economic productivity, not through monetary policy. Natural deflation — prices falling as the economy grows — is the expected and healthy outcome.

THM represents what Bitcoin would look like as a mature monetary standard, with the adoption volatility and premium factored out — the end state rather than the current transition. This framing distinguishes THM from simply "hard money."

This framing is now explicit in site copy: the About page two-point founding premise, the THMExplainer on the dashboard, and the "Why THM and Bitcoin are the same question" section on /lens/thm all state this connection directly. Bitcoin frequently tracks the THM line over long windows — this is not coincidence but convergence. The adoption phase is shortening the gap. THM is where it ends.

---

*FreeMarketWatch · June 2026*
*Companion documents: FMW_Architecture.md, FMW_Content.md, CLAUDE.md*
