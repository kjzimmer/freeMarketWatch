# FreeMarketWatch — CC Briefing
## Purchasing Power Formula Update + Content Changes
### June 2026

---

## Read this first

Read CLAUDE.md, FMW_Vision.md, FMW_Architecture.md, and
FMW_Content.md before starting anything. This briefing assumes
you have full context of the current implementation.

Do a codebase review before touching anything. Answer:
1. Where exactly is `purchasing-power.ts` and what does it
   currently implement?
2. How does `computePPSeries.ts` currently call it?
3. How does `thm-m2gdp.ts` currently interpolate annual M2/GDP
   to monthly points — confirm the interpolation logic in
   `interpolate.ts` is reusable for asset deflation.
4. What does the `market_pp_series` schema note say about the
   `pp_index` column — confirm it says "CPI-adjusted" and update
   that comment in the schema after this change.

Write a brief codebase summary before proceeding.

---

## Why this change is being made

The site's thesis is that purchasing power is the only honest lens
for measuring any asset or currency. The theoretical framework is:

```
Purchasing power of any currency = f(GDP / M2)

M2 increases  → more dollars per unit of goods → PP falls
GDP increases → more goods per dollar         → PP rises
Net effect    = M2/GDP ratio
```

THM is already calculated using M2/GDP. Every asset on the
dashboard is currently deflated using CPI. This is an
inconsistency — THM and the assets it measures are using
different theoretical frameworks.

This change makes everything consistent: THM and all assets
use the same M2/GDP deflator. The dashboard then shows, for
every asset: how did it perform against the M2/GDP measure
of monetary debasement?

This is a meaningful change. Chart lines will shift. The
methodology documentation and site copy must be updated
to match.

---

## Workstream 1 — Formula change in purchasing-power.ts

### 1.1 New formulas

Replace all CPI-based deflation with M2/GDP-based deflation.

```typescript
// OLD
USD:          100 × (CPI_start / CPI_t)
Currencies:   100 × (FX_start / FX_t) × (CPI_start / CPI_t)
Equities/BTC: 100 × (price_t / price_start) × (CPI_start / CPI_t)

// NEW
USD:          100 × (M2GDP_start / M2GDP_t)
              where M2GDP_t = M2_t / GDP_t

Currencies:   100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)

Equities/BTC: 100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
```

Where:
- M2GDP_t = annual M2_t / annual GDP_t, interpolated to monthly
  using the SAME interpolation logic already used in thm-m2gdp.ts
- M2GDP_start = M2/GDP ratio at the window start date

### 1.2 Interpolation

Annual M2 and GDP data already exists in `market_m2_history`
and `market_gdp_history`. The M2/GDP ratio is already computed
and interpolated to monthly points in `thm-m2gdp.ts`.

Do NOT duplicate that logic. Extract the interpolated M2/GDP
monthly series into a shared utility or reuse the existing
calculation. The same monthly M2/GDP series that drives the
THM line also drives the asset deflation. They must be
identical — computed once, used for both.

### 1.3 CPI data

CPI data remains in the DB and continues to be fetched. It is
still used for the three-method THM comparison on /lens/thm
(THM_CPI variant). Do not remove CPI fetching or the
market_cpi_history table.

The `nominal_index` column in `market_pp_series` (dollar-
denominated, not deflated) is unchanged — it does not use CPI.

### 1.4 Schema comment update

The `market_pp_series` table comment and the `pp_index` column
comment currently say "CPI-adjusted." Update these comments to
say "M2/GDP-adjusted" to match the new implementation.

Do not change the schema structure — column names, types, and
constraints are unchanged.

### 1.5 Verification

After implementation, verify:

- USD purchasing power over 10Y window declines at approximately
  3.5%/yr annualized (vs ~3.2%/yr under CPI). The line should
  be slightly lower (more debasement shown) than before.
- Gold (GLD) over 10Y should show a modestly different line than
  before — not dramatically different, but visibly shifted.
- THM line itself is UNCHANGED — it still uses thm-m2gdp.ts.
  Only the asset series change.
- The THM line and USD line should now be derived from the same
  underlying M2/GDP series. Their relationship should be
  mathematically exact: USD_PP × THM = 100² at any point
  (they are exact inverses when both indexed to 100 at window
  start). Verify this holds.

---

## Workstream 2 — Content changes (no code)

All content changes below are to React page components.
No backend changes. No routing changes.

### 2.1 About page — add two-point founding premise

File: `client/src/pages/About.tsx`

In the opening section (before "How to read the charts"),
add or replace the site purpose statement with this precise
two-point framing:

---
FreeMarketWatch is built on two premises.

**First:** purchasing power is the only honest lens for
understanding any currency or asset. Nominal prices, dollar
returns, percentage gains — all measure distance with a ruler
that shrinks a little every year. The only question that matters
is: does this asset let you buy more or less over time?

**Second:** THM — Theoretical Hard Money — represents what Bitcoin
would look like as a mature monetary standard, with the adoption
phase factored out. Bitcoin has the right monetary properties:
fixed supply, no controlling authority, no political convenience.
But it is in an adoption phase that makes its current price
reflect speculation as much as monetary properties. THM is our
best estimate of where Bitcoin arrives when that adoption is
complete — the end state, not the transition.

Against that benchmark, the picture of which assets genuinely
preserve value changes dramatically from what standard financial
analysis shows.
---

Also update the methodology note in the About page to say
"M2/GDP-adjusted" instead of "CPI-adjusted" — the deflator
has changed.

### 2.2 THM explainer on dashboard — update copy

File: `client/src/components/THMExplainer.tsx`

Update the explainer to reflect:
1. What THM is (the fixed ruler — purchasing power benchmark)
2. How it's calculated (M2/GDP — money supply growth above
   real economic output)
3. The Bitcoin connection — THM represents post-adoption Bitcoin
4. What the chart shows — assets above the line are genuinely
   gaining purchasing power; below it are losing ground

Keep it short — this is a dashboard callout, not a methodology
page. Aim for 3-4 short paragraphs maximum.

Suggested copy:

---
**THM — The Fixed Ruler**

Every financial chart measures value in dollars. This one
doesn't. The dashed green line is THM — Theoretical Hard Money
— the fixed ruler.

THM represents what money would look like if the supply had
never grown faster than the real economy. It is calculated from
the M2/GDP ratio: when the money supply grows faster than real
output, the excess is pure debasement. THM tracks that excess.

More precisely: THM represents what Bitcoin looks like as a
mature monetary standard — fixed supply, no inflation, value
that grows only with genuine economic productivity. Bitcoin is
getting there. THM is the destination.

Everything above this line is genuinely gaining purchasing power.
Everything below it is losing ground, regardless of what the
dollar price shows.

[How we define THM →]
---

### 2.3 THM Lens page — add unified theory section

File: `client/src/pages/LensTHM.tsx`

Add a new section BEFORE the three approaches section.
Title: "The underlying framework"

Content:

---
Before examining three ways to calculate THM, it helps to
understand the single framework they are all variations of.

Purchasing power of any currency is determined by two forces
working in opposite directions:

**M2 growth pulls purchasing power down.** When more dollars
are created, each existing dollar represents a smaller fraction
of the total. This is debasement — pure dilution of the
monetary unit.

**GDP growth pushes purchasing power up.** When the economy
produces more goods and services per dollar, each dollar buys
more. This is the natural deflation of a productive economy —
abundance increasing faster than money.

The net effect is the ratio:

```
Purchasing power ∝ GDP / M2
```

In log space, these two forces add and subtract cleanly:
```
log(PP) = log(GDP growth) − log(M2 growth)
```

**For THM:** money supply is fixed by definition. M2 growth = 0.
The only force acting is GDP growth. THM purchasing power rises
at the real output growth rate — roughly 3%/yr historically.
This is the natural deflation a sound money holder should receive
as the economy becomes more productive.

**For the dollar:** both forces are active. M2 has grown at
6.6%/yr since 1913. GDP has grown at 3.0%/yr. The net result:
the dollar loses approximately 3.5%/yr in purchasing power —
which is what you observe on the charts.

The three approaches below differ in how they handle this
framework — specifically, whether growing economies are assumed
to need proportionally more money (Keynesian) or not (Austrian).
But all three are ultimately measuring the same two forces.
---

### 2.4 THM Lens page — add Bitcoin framing section

File: `client/src/pages/LensTHM.tsx`

Add a new section AFTER "Where we are and what we're asking"
and BEFORE the closing footer note.
Title: "Why THM and Bitcoin are the same question"

Content:

---
THM did not emerge from abstract theory. It emerged from a
specific question: if Bitcoin is the right answer to monetary
debasement, what does the destination look like?

Bitcoin has the properties of sound money: fixed supply of 21
million, no controlling authority, issuance that cannot be
changed by political convenience. In the long run, these
properties should make it the hardest money ever created.

But Bitcoin is currently in an adoption phase. Its price
reflects not just its monetary properties but the speculation,
volatility, and uncertainty of a new monetary technology finding
its place in the world. Using current Bitcoin as a benchmark
would make every other asset appear worthless — not because they
are, but because Bitcoin's adoption curve dominates the chart.

THM factors out the adoption phase. It asks: what would Bitcoin
look like if adoption were complete — if the world had already
accepted it as the monetary standard and the speculative premium
had been fully realized? A currency with fixed supply, value
growing only with real economic productivity, no debasement.

That is THM. Not Bitcoin today. Bitcoin arrived.

When you look at the 10-year charts on this site and see Bitcoin
approaching or tracking the THM line over long windows, you are
seeing evidence that the two are converging. The adoption phase
is shortening the gap. THM is where it ends.
---

### 2.5 THM Lens page — add foreign currency scope note

File: `client/src/pages/LensTHM.tsx`

Add a short note in the "Where we are and what we're asking"
section, or as a standalone paragraph before it.

Content:

---
**A note on foreign currencies**

The GDP/M2 framework applies in principle to every currency —
each has its own money supply and its own real output. A fully
consistent implementation would calculate purchasing power for
the euro, yen, and pound using their own GDP/M2 ratios.

In practice, we use market exchange rates to bring foreign
currencies into the comparison. This is a scope decision, not
a theoretical one. Building consistent GDP/M2-based purchasing
power series for multiple currencies with different central bank
reporting conventions, different monetary aggregate definitions,
and different GDP measurement methodologies is a significant
research project. The currency panel shows how major currencies
perform against THM when converted at market rates — a meaningful
and honest comparison, even if it does not decompose each
currency's internal monetary dynamics.

The theoretical extension to GDP/M2-based cross-currency
comparison is noted here as future research.
---

---

## Workstream 3 — Documentation updates

After implementing Workstreams 1 and 2, update the three
companion docs to reflect the new state. This is the final
step — documentation reflects what is actually implemented.

### 3.1 CLAUDE.md

Update the "Purchasing Power Formulas" section and the
"USD Purchasing Power" and "Other Currencies" subsections
under Core Concepts:

```
USD:          100 × (M2GDP_start / M2GDP_t)
              where M2GDP_t = M2_t / GDP_t (interpolated to monthly)
Currencies:   100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)
Equities/BTC: 100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
```

Remove references to CPI as the purchasing power deflator for
assets. CPI remains in use only for THM_CPI variant on /lens/thm.

Update "Resolved design decisions" to add:
- Purchasing power deflator: M2/GDP basis (not CPI)

Update the note on `market_pp_series` to remove "CPI-adjusted"
from the column description.

### 3.2 FMW_Vision.md

Update the "founding premise" section to include the two-point
statement (purchasing power as the only honest lens + THM as
post-adoption Bitcoin).

Update the THM section to note:
- The purchasing power deflator for all assets is now M2/GDP,
  consistent with the THM benchmark itself.
- CPI is retained only for the three-method comparison on
  /lens/thm.

### 3.3 FMW_Architecture.md

Update the "Purchasing Power Formulas" table:

| Series | Formula |
|--------|---------|
| USD | `100 × (M2GDP_start / M2GDP_t)` |
| EUR, JPY, GBP, CNY | `100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)` |
| Equities, ETFs, BTC | `100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)` |
| Nominal currency | `100 × (FX_start / FX_t)` (unchanged) |
| Nominal equity | `100 × (price_t / price_start)` (unchanged) |

Where `M2GDP_t = M2_t / GDP_t`, linearly interpolated to
monthly using the same logic as thm-m2gdp.ts.

Update the data pipeline section to note that the M2/GDP
monthly series is now used for both THM calculation and
asset deflation — computed once, shared.

Update the `market_pp_series` table description: change
"CPI-adjusted" to "M2/GDP-adjusted" in the `pp_index`
column description.

Add a note under data sources: CPI (FRED CPIAUCNS) is
retained for the /lens/thm three-method comparison charts
(THM_CPI variant). It is no longer used as the primary
purchasing power deflator for dashboard assets.

---

## Sequencing

```
1. Codebase review — answer the four questions above
2. Workstream 1 — formula change + verification
3. Workstream 2 — content changes (no dependencies on W1)
4. Workstream 3 — documentation update (do last, reflects reality)
5. Full staging validation before production push
```

Workstreams 1 and 2 can be done in parallel — they do not
depend on each other. Documentation (Workstream 3) must be
done last — it documents what was actually implemented.

---

## Staging validation checklist

- [ ] USD 10Y line is lower than before (more debasement shown)
- [ ] THM line is unchanged
- [ ] USD × THM = 100² relationship holds (they are exact inverses)
- [ ] Gold, BTC, equities lines shift modestly — not dramatically
- [ ] /lens/thm charts are unchanged (use their own data pipeline)
- [ ] About page two-point premise is present and correct
- [ ] THMExplainer shows Bitcoin framing
- [ ] /lens/thm unified theory section present
- [ ] /lens/thm Bitcoin framing section present
- [ ] /lens/thm foreign currency scope note present
- [ ] CLAUDE.md, FMW_Vision.md, FMW_Architecture.md updated
- [ ] No console errors
- [ ] Mobile layout correct on all updated pages

---

## Definition of done

All items in staging checklist confirmed.
Documentation updated to reflect actual implementation.
Owner reviews staging before production push.
Manual DB backup taken before production push.

---

*June 2026*
*freeMarketWatch.world*
*Companion files: CLAUDE.md, FMW_Vision.md, FMW_Architecture.md,*
*FMW_Content.md*
