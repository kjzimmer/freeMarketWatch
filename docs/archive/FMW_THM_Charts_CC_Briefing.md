# FreeMarketWatch — CC Briefing
## THM Methodology Charts + Data Infrastructure
### Phase 2 addition — /learn section Topic 1

*Read CLAUDE.md and the existing codebase before starting anything.*
*This briefing contains intellectual context and precise requirements.*
*All implementation decisions (schema, data storage, chart integration)*
*must be based on what you find in the codebase, not assumed in advance.*

---

## Step 0 — Read the codebase first. Answer these questions before writing a line of code.

Before touching anything, read the existing codebase and answer:

1. How is THM currently calculated? On the fly in the frontend, in a
   backend job, or stored in the DB?

2. What does the existing DB schema look like? What tables exist, what
   are their structures, and how is time-series data stored?

3. What data does the site already pull from external sources? Where
   does CPI currently come from — FRED, a static file, something else?

4. How frequently does existing data update — daily, weekly, on demand?

5. Is there already a FRED API integration? If so, what series are
   already being pulled?

6. How are chart data endpoints structured? Does the frontend call
   separate endpoints per series, or does one endpoint return multiple
   series for a chart?

Write your answers to these six questions as a short codebase summary
at the top of your implementation plan before proceeding. If anything
is ambiguous, note it.

---

## Context: what this work is for

The site is adding a new section to /learn. The /learn section is being
restructured from a single six-act series into a topic library. This
work supports **Topic 1: THM — How to Define the Fixed Ruler**.

THM (Theoretical Hard Money) is the benchmark that defines the entire
site. Every chart on FreeMarketWatch measures assets against THM rather
than against the dollar. The thesis: you cannot understand what anything
is truly worth using a currency that loses value every year. THM is the
fixed ruler. Dollar charts are a shrinking one.

Topic 1 is a methodology transparency page that explains how THM is
calculated, why it is hard, and what three different economic frameworks
say the answer should be. The page is written. It needs charts to make
the argument visual.

The full methodology page text is in:
`FMW_THM_Methodology_v2.md` (in the project docs)

Read it. The charts must connect precisely to the arguments made there.

---

## What needs to be built

### Part 1 — Data infrastructure

Two new data series need to be added to the database and kept current:

**Series 1: US M2 Money Supply**
- Unit: billions of USD
- Frequency: monthly (annual average sufficient for THM charts)
- Historical range needed: 1913 to present
- FRED series ID (1959–present): `M2SL`
- Pre-1959 source: Friedman & Schwartz estimates (see static data below)
- Update frequency: monthly (FRED updates M2 monthly)

**Series 2: US Real GDP**
- Unit: billions of chained 2017 dollars
- Frequency: quarterly (annual average sufficient for THM charts)
- Historical range needed: 1913 to present
- FRED series ID (1947–present): `GDPC1`
- Pre-1947 source: BEA historical estimates (see static data below)
- Update frequency: quarterly (BEA updates with ~1 month lag)

**FRED API access:**
FRED provides free API access. Base URL:
`https://fred.stlouisfed.org/graph/fredgraph.csv?id=SERIES_ID`
No API key required for CSV downloads. JSON API available with free
key from fred.stlouisfed.org if preferred.

**Static historical data (pre-FRED coverage):**

Use these values for years before FRED series begin. These are sourced
from Friedman & Schwartz "A Monetary History of the United States" and
BEA historical national accounts. They are well-established in the
academic literature.

M2 (billions USD) — annual, Friedman & Schwartz estimates:
```
1913: 18.5   1914: 18.8   1915: 19.9   1916: 22.6   1917: 25.7
1918: 29.2   1919: 33.9   1920: 35.2   1921: 32.5   1922: 33.4
1923: 36.1   1924: 37.6   1925: 40.4   1926: 42.0   1927: 43.7
1928: 45.7   1929: 46.4   1930: 44.8   1931: 41.0   1932: 35.4
1933: 31.9   1934: 33.9   1935: 38.1   1936: 43.0   1937: 44.5
1938: 44.9   1939: 49.3   1940: 54.5   1941: 62.0   1942: 74.4
1943: 93.5   1944: 108.8  1945: 126.6  1946: 138.7  1947: 146.0
1948: 147.4  1949: 148.0  1950: 150.9  1951: 158.1  1952: 165.0
1953: 170.5  1954: 175.9  1955: 183.6  1956: 188.7  1957: 193.7
1958: 200.5
```
FRED M2SL begins January 1959 — use that series from 1959 forward.

Real GDP (billions 2017 USD) — annual, BEA historical:
```
1913: 823    1914: 792    1915: 814    1916: 892    1917: 904
1918: 990    1919: 966    1920: 966    1921: 880    1922: 959
1923: 1075   1924: 1085   1925: 1130   1926: 1193   1927: 1207
1928: 1228   1929: 1267   1930: 1140   1931: 1039   1932: 899
1933: 885    1934: 966    1935: 1064   1936: 1196   1937: 1245
1938: 1183   1939: 1290   1940: 1367   1941: 1574   1942: 1848
1943: 2134   1944: 2239   1945: 2239   1946: 1793   1947: 1776
```
FRED GDPC1 begins Q1 1947 — use that series from 1947 forward,
converting quarterly to annual averages.

---

### Part 2 — THM calculation formulas

Three THM series need to be calculated and stored (or calculated
on the fly — your call based on what you find in the codebase).

All three are indexed to 100 at the base year (1913).

**Base values (1913):**
- CPI base: use whatever CPI value the site already uses for 1913
- M2 base: 18.5 (billion USD)
- Real GDP base: 823 (billion 2017 USD)
- THM base: 100

**THM productivity growth assumption:** 2% per year
(This is applied identically across all three approaches — it represents
the real productivity growth that sound money should reflect. The
debasement deflator changes; the productivity component stays constant.)

**Formula for each year Y, starting from base year B:**

```
years_elapsed = Y - B

productivity_component = (1.02) ^ years_elapsed

THM_CPI(Y) = 100 × productivity_component × (CPI_Y / CPI_B)

THM_M2_GDP(Y) = 100 × productivity_component × (M2_Y / GDP_Y) / (M2_B / GDP_B)

THM_M2_RAW(Y) = 100 × productivity_component × (M2_Y / M2_B)
```

Plain English:
- THM_CPI: grows with CPI inflation plus 2% productivity
- THM_M2_GDP: grows with excess money supply growth (M2 above GDP)
  plus 2% productivity
- THM_M2_RAW: grows with total M2 growth plus 2% productivity

The three lines will diverge significantly over 111 years. That
divergence is the point — it shows readers the range of honest
disagreement about what the benchmark should be.

**Verification check — run this before considering the data correct:**

At year 2024, approximate expected THM index values (base 100 in 1913):
- THM_CPI: roughly 3,000–4,000
- THM_M2_GDP: roughly 4,000–5,000
- THM_M2_RAW: roughly 100,000–150,000

The raw M2 THM will be dramatically higher than the other two. That is
correct and intentional — it is the visual point the methodology page
makes. If your numbers are in a different order of magnitude, check the
formula.

---

### Part 3 — Charts to build

Three charts are needed for the THM methodology page. They are
educational, not real-time financial data — they tell a story.
Annual data points are sufficient (no need for monthly granularity).

---

**Chart 1: The Three THM Lines (1913–present)**

*Purpose:* Show the three approaches on one chart so readers can see
how dramatically the choice of deflator affects the benchmark.

*Series:*
- THM_CPI (label: "THM — Inflation Index")
- THM_M2_GDP (label: "THM — M2/GDP")
- THM_M2_RAW (label: "THM — Raw M2 (Austrian)")
- A flat line at 100 representing "the dollar" — purchasing power
  of $1 in 1913, held as cash. This never moves. It sits at 100
  forever, which is the point: everything else moves away from it.

*Note on scale:* THM_M2_RAW will be orders of magnitude above the
other two. Use a log scale on the Y axis. This is appropriate here —
the methodology page explains why the gap is so large, and a log
scale makes all three lines readable simultaneously.

*Annotation:* Mark 1971 (Nixon shock) with a vertical dashed line.
The divergence accelerates visibly after that point.

*What this chart is saying:* Depending on which economic framework
you accept, the honest THM benchmark is somewhere between these lines.
The dollar (flat at 100) has preserved none of the value that any
version of sound money would have.

---

**Chart 2: Purchasing Power of the 1913 Dollar (1913–present)**

*Purpose:* Show the inverse — not where THM went, but how much of
its 1913 value the dollar retained under each measure.

*This is THM inverted:* purchasing_power(Y) = 100 / THM(Y) × 100

*Series:*
- Dollar purchasing power — CPI method
- Dollar purchasing power — M2/GDP method
- Dollar purchasing power — Raw M2 method

*Scale:* Linear. All three lines start at 100 and decline toward zero.
CPI and M2/GDP end near 2–3 cents. Raw M2 ends near 0.09 cents.

*What this chart is saying:* Three honest measures of what happened
to the dollar since 1913. The range of the answer — from 3 cents to
0.09 cents — reflects genuine economic disagreement, not measurement
error.

*Annotation:* Same 1971 vertical marker. Label the endpoint values
explicitly on the chart: "3.1¢", "2.3¢", "0.09¢".

---

**Chart 3: The Productivity Deflation Gap (1913–present)**

*Purpose:* Illustrate the insight that the difference between raw M2
and M2/GDP is not noise — it is the natural productivity deflation
that should have accrued to money holders under a fixed supply.

*Series:*
- Real GDP index (1913 = 100) — how much bigger the economy got
- M2 index (1913 = 100) — how much the money supply grew
- The ratio M2/GDP (1913 = 100) — excess money above output

*What this chart is saying:* M2 grew 1,200x. The economy grew 27x.
The gap between them — 44x — is the productivity deflation that
under sound money would have made goods progressively cheaper.
Instead it was captured by money creation.

*Label clearly:* "M2 grew 1,200x. Economy grew 27x. The gap is what
sound money holders lost."

---

### Part 4 — Where these charts live

The charts belong on the THM methodology page, which will be located
at `/learn/thm` or `/learn/topic/thm` — confirm the route structure
with the Phase 2 briefing (FreeMarketWatch_Phase2_Briefing.md) and
whatever routing exists in the current codebase.

The /learn section is being restructured from a single six-act series
into a topic library. This is Topic 1. The six acts become Topic 2
("The Case for Hard Money"). The routing change is a separate task —
coordinate with Phase 2 briefing. Do not restructure /learn routing
as part of this task unless it is already done.

The charts should use the existing chart component patterns in the
codebase — same styling, same color tokens, same responsive behavior
as the dashboard charts. These are educational charts, not dashboard
panels, so they do not need the 1Y/5Y/10Y timeframe toggle. Full
history only.

---

### Part 5 — New environment variables needed

If FRED JSON API is used (preferred over CSV for error handling):

| Variable | Value | Notes |
|----------|-------|-------|
| `FRED_API_KEY` | from fred.stlouisfed.org | Free registration |

Add to Railway Variables in both environments. CSV download works
without a key but JSON API is cleaner for production use.

---

### Part 6 — Data update schedule

M2 updates monthly (FRED, ~4 week lag).
Real GDP updates quarterly (FRED/BEA, ~30 day lag after quarter end).

These do not need to update as frequently as market data. A weekly
or even monthly refresh job is sufficient for the THM methodology
charts — the story they tell does not change month to month.

Integrate into whatever existing data refresh infrastructure exists.
Do not create a separate scheduler if one already exists.

---

### Part 7 — Seed and backfill

On first deploy:
1. Load all static historical data (1913–1958 M2, 1913–1946 GDP)
   as a one-time seed
2. Fetch full FRED history for M2SL (back to 1959) and GDPC1
   (back to 1947) via FRED API
3. Calculate all three THM series from combined data
4. Verify output against the expected values in Part 2

The static historical data should be stored as seed data in the
codebase (a JSON or SQL seed file), not fetched from an external
source. It will never change — these are historical estimates from
published academic sources.

---

### Part 8 — What not to build in this task

- Do not restructure the /learn routing (separate task)
- Do not rebuild the dashboard charts (separate task)
- Do not add a THM toggle to the dashboard charts yet — that comes
  after this page is validated and the methodology is confirmed
- Do not change how the existing THM line on the dashboard is
  calculated until the owner reviews the new charts and makes a
  decision on which approach to adopt going forward

The existing dashboard THM line stays as-is. This task adds new
data, new calculations, and new charts to the methodology page only.
Changes to the dashboard THM are a separate decision that follows
from this work.

---

### Part 9 — Definition of done

- [ ] M2 and Real GDP data in database, 1913–present, updating automatically
- [ ] Three THM series calculated and accessible via API endpoint
- [ ] Chart 1: Three THM lines on log scale, 1913–present, 1971 annotation
- [ ] Chart 2: Purchasing power decline, linear scale, endpoint labels
- [ ] Chart 3: M2 vs GDP vs ratio, 1913–present
- [ ] All charts styled consistently with existing site design system
- [ ] Charts render correctly on mobile
- [ ] Existing dashboard THM line unchanged
- [ ] Data seed file committed to repo for the static historical values
- [ ] API endpoint documented in codebase (inline comments sufficient)

---

*Phase 2 addition — May 2026*
*Companion files: CLAUDE.md, FreeMarketWatch_Phase2_Briefing.md,*
*FMW_THM_Methodology_v2.md (methodology page text — read this)*
*freeMarketWatch.world*
