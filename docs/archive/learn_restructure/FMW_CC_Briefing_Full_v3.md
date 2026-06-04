# FreeMarketWatch — CC Briefing
## Phase 2 + Lens Section + THM Data Infrastructure
### Version 3.0 — May 2026

*Read CLAUDE.md and the full codebase before starting anything.*
*Multiple workstreams are defined here. Sequence them carefully.*
*Do not begin implementation on any workstream without first*
*completing Step 0 and confirming the codebase answers.*

---

## Step 0 — Codebase review first. Always.

Before writing a line of code, read the existing codebase and answer:

1. How is THM currently calculated? Frontend, backend job, or DB?
2. What does the existing DB schema look like?
3. Where does CPI currently come from?
4. What existing FRED API integration exists, if any?
5. How are chart data endpoints structured?
6. What is the current routing structure under /learn?
7. How is the current THM line labeled and described in the UI?

Write answers as a codebase summary before proceeding.

---

## Workstream A — Navigation and routing restructure

### A.1 Replace /learn with /lens

The /learn section is being replaced with /lens — The Lens.
New route structure:

```
/lens                     → Hub page
/lens/fiat                → Component 1 hub (six acts)
/lens/fiat/act/:n         → Individual acts 1-6 (existing content)
/lens/thm                 → Component 2 (THM methodology)
/lens/investing           → Component 3 (investing framework)
```

Redirect /learn → /lens
Redirect /learn/act/:n → /lens/fiat/act/:n

### A.2 Navigation bar update

Replace "Learn" nav item with "The Lens"
Add dropdown/hover expand showing three components:
- Why the Fiat Lens Distorts → /lens/fiat
- The THM Lens → /lens/thm
- Investing Through the THM Lens → /lens/investing

### A.3 Footer update

Update footer links to match new routing.

---

## Workstream B — The Lens hub and component pages

All written content is in companion documents. Implement
faithfully — do not paraphrase or restructure.

### B.1 The Lens hub page (/lens)

Content: FMW_Lens_Hub_And_Wrappers.md — "THE LENS Hub Page" section
Three component cards with status indicators:
- Component 1: green/solid badge — "Established"
- Component 2: amber badge — "Established · Open questions"
- Component 3: blue badge — "In development"

### B.2 Component 1 — Why the Fiat Lens Distorts (/lens/fiat)

Content: FMW_Lens_Hub_And_Wrappers.md — "COMPONENT 1 WRAPPER" section

Structure:
- Introduction wrapper (new — in companion doc)
- Six act cards grid (existing content, no changes)
- Closing transition (new — in companion doc)

The six individual act pages (/lens/fiat/act/:n) are unchanged
from the existing /learn/act/:n implementation. Move them,
do not rewrite them.

### B.3 Component 2 — The THM Lens (/lens/thm)

Content: FMW_THM_Methodology_v3.md (full written content)
Plus four research charts — see Workstream C for chart specs.

Page structure:
- Component header with epistemic status note
- Full methodology text from FMW_THM_Methodology_v3.md
- Four research charts (built in Workstream C)
- Open dialog / contact invitation
- Closing transition to Component 3

**Reconciliation note — current live page vs this briefing:**
The current live page is at /learn/thm (client/src/pages/LearnTHM.tsx).
THM_Page_Current_State.md documents its exact content.
Key differences between the live page and what this briefing builds:

1. BENCHMARK: Live page uses CPI + 2% productivity. This briefing
   switches to M2/GDP, no 2% addition. This is the primary change.

2. SECTION 1 WORDING: The live page has one sentence worth preserving
   verbatim — use it in FMW_THM_Methodology_v3.md Section 1:
   "THM answers a specific question: if money had been honest —
   if it had held its purchasing power and grown only with real
   economic productivity — where would that benchmark be today?"
   This is tighter than the v3 draft equivalent. Keep it.

3. EURODOLLAR SECTION: Live page flags this as "not yet on page."
   FMW_THM_Methodology_v3.md has a full section on it — implement
   that. Use the framing "a fourth dimension of the debasement
   question" from the current page summary — it is cleaner.

4. CHART 4 (stolen deflation): Not in the live page. New work.
   See Workstream C for spec.

5. ROUTE: Live page is /learn/thm. New route is /lens/thm.
   Redirect /learn/thm → /lens/thm per Workstream A.

### B.4 Component 3 — Investing Through the THM Lens (/lens/investing)

Content: FMW_Lens_Hub_And_Wrappers.md — "COMPONENT 3" section

Display the epistemic status note prominently — this content
is explicitly theoretical and in development. Style differently
from Component 1 to make the distinction clear.

---

## Workstream C — THM data infrastructure and research charts

This is the most technically complex workstream. Complete
Workstream A routing before starting, so chart pages have
a place to live.

### C.1 New data series

**US M2 Money Supply**
FRED series: M2SL (monthly, 1959–present)
Pre-1959 static seed data (Friedman & Schwartz):
```
1913:18.5  1914:18.8  1915:19.9  1916:22.6  1917:25.7
1918:29.2  1919:33.9  1920:35.2  1921:32.5  1922:33.4
1923:36.1  1924:37.6  1925:40.4  1926:42.0  1927:43.7
1928:45.7  1929:46.4  1930:44.8  1931:41.0  1932:35.4
1933:31.9  1934:33.9  1935:38.1  1936:43.0  1937:44.5
1938:44.9  1939:49.3  1940:54.5  1941:62.0  1942:74.4
1943:93.5  1944:108.8 1945:126.6 1946:138.7 1947:146.0
1948:147.4 1949:148.0 1950:150.9 1951:158.1 1952:165.0
1953:170.5 1954:175.9 1955:183.6 1956:188.7 1957:193.7
1958:200.5
```

**US Real GDP**
FRED series: GDPC1 (quarterly, 1947–present — average to annual)
Pre-1947 static seed data (BEA historical):
```
1913:823  1914:792  1915:814  1916:892  1917:904
1918:990  1919:966  1920:966  1921:880  1922:959
1923:1075 1924:1085 1925:1130 1926:1193 1927:1207
1928:1228 1929:1267 1930:1140 1931:1039 1932:899
1933:885  1934:966  1935:1064 1936:1196 1937:1245
1938:1183 1939:1290 1940:1367 1941:1574 1942:1848
1943:2134 1944:2239 1945:2239 1946:1793
```

Commit all static data as a seed file in the repo.
Never fetch historical static data from external sources.

### C.2 Three THM calculations

**CRITICAL — formula correction from previous briefings:**
The 2% productivity addition has been removed from all three
formulas. THM represents purchasing power preservation only.

```
THM_CPI(Y)    = 100 × (CPI_Y / CPI_1913)

THM_M2GDP(Y)  = 100 × (M2_Y / GDP_Y) / (M2_1913 / GDP_1913)

THM_M2RAW(Y)  = 100 × (M2_Y / M2_1913)
```

Expected values at 2024 (verify before proceeding):
- THM_CPI:    ~3,200
- THM_M2GDP:  ~4,300
- THM_M2RAW:  ~116,000

If your numbers differ significantly, check the formula.
THM_M2RAW being orders of magnitude above others is correct.

### C.3 Dashboard THM update

**IMPORTANT:** The existing dashboard THM line must be updated:
- Switch from CPI-based to M2GDP-based
- Remove the 2% annual productivity component
- Update tooltip copy — see FMW_Dashboard_Copy_v3.md
- Display the methodology change note during transition period
  (see Dashboard Copy v3 — remove after 30 days)

This is a visible change to the main dashboard. Test carefully.
The line will move. The story it tells does not change materially.

### C.4 Four research charts for /lens/thm

Annual data only. Full 1913–present history. No timeframe toggle.
Match existing site design tokens and chart component patterns.

**Chart 1: The Three THM Lines**
- Series: THM_CPI, THM_M2GDP, THM_M2RAW, Dollar flat at 100
- Labels: "THM — Inflation Index", "THM — M2/GDP (primary)",
  "THM — Raw M2 (Austrian)", "Dollar (1913 = 100)"
- Scale: logarithmic Y axis (required — M2RAW is 36× above M2GDP)
- Annotation: vertical dashed line at 1971, "Nixon shock"
- THM_M2GDP styled as primary (THM green, slightly thicker)
- THM_M2RAW styled as exploratory (lighter, dashed)

**Chart 2: Purchasing Power of the 1913 Dollar**
- Formula: pp(Y) = (100 / THM(Y)) × 100
- Series: one line per THM approach
- Scale: linear
- Endpoint labels on chart: "3.1¢" (CPI), "2.3¢" (M2/GDP),
  "0.09¢" (Raw M2)
- Same 1971 annotation

**Chart 3: The Output Deflation Gap**
- Series: Real GDP index (1913=100), M2 index (1913=100),
  M2/GDP ratio index (1913=100)
- Scale: logarithmic
- Endpoint labels: "M2 grew 1,160×", "Economy grew 27×",
  "Excess: 43×"
- Caption: "The gap between M2 and GDP growth is the natural
  price deflation that sound money holders should have received
  as the economy grew. Instead it was captured by money creation."

**Chart 4: The Stolen Deflation**
- Formula: stolen(Y) = THM_M2RAW(Y) / THM_M2GDP(Y)
- Single series, starts at 1.0 in 1913, ends ~27 in 2024
- Scale: linear
- Label: "The deflation that should have been yours"
- Caption: "Grows at ~3%/yr — the real output growth rate.
  By 2024: 27× the 1913 value. Every dollar of real economic
  progress since 1913 was, in purchasing power terms, captured
  upstream rather than passed to money holders as cheaper prices."

### C.5 Data update schedule

M2: monthly (integrate with existing refresh infrastructure)
Real GDP: quarterly (integrate with existing refresh infrastructure)
Do not create a separate scheduler.

---

## Workstream D — About page and copy updates

### D.1 About page

Replace current about page with content from FMW_About_Page_v3.md.
No implementation decisions — this is a content swap.

### D.2 Dashboard intro copy

Update dashboard intro above charts.
Content: FMW_Dashboard_Copy_v3.md — "Dashboard intro" section.

### D.3 THM tooltip

Update tooltip on the THM line.
Content: FMW_Dashboard_Copy_v3.md — "THM line tooltip" section.

### D.4 Panel subtitles

Update the subtitle/description under each panel heading.
Content: FMW_Dashboard_Copy_v3.md — "Panel subtitles" section.

### D.5 The Lens callout card on dashboard

Add a card on the dashboard (below or alongside panels) linking
to /lens with the short copy from FMW_Dashboard_Copy_v3.md.

---

## Workstream E — Phase 2 items not yet complete

Check Phase 2 briefing (FreeMarketWatch_Phase2_Briefing.md)
for any items not yet implemented. Specifically confirm:

- Contact page (/contact) with Formspree — built?
- Favicon and app icons — generated?
- Navigation bar and footer — built?
- Routing (React Router) — installed and configured?

If Phase 2 items are incomplete, complete them before or
alongside the workstreams above. The routing work in
Workstream A depends on React Router being installed.

---

## Sequencing recommendation

```
1. Step 0 — codebase review and answers
2. Workstream E — confirm Phase 2 status, complete if needed
3. Workstream A — routing restructure (/learn → /lens)
4. Workstream D — copy updates (about, dashboard, tooltips)
5. Workstream B — Lens hub and component pages (content)
6. Workstream C — data infrastructure and research charts
```

C is last because it is the most complex and depends on
routing (A) being in place for the chart pages to live.
Copy (D) is early because it is low-risk and high visibility.

---

## Definition of done — full checklist

**Routing**
- [ ] /lens hub page live
- [ ] /lens/fiat hub with six act cards
- [ ] /lens/fiat/act/:n individual acts working
- [ ] /lens/thm methodology page live
- [ ] /lens/investing component 3 page live
- [ ] /learn and /learn/act/:n redirect correctly
- [ ] Navigation updated to "The Lens" with dropdown

**Content**
- [ ] Component 1 introduction wrapper present
- [ ] Component 1 closing transition present
- [ ] Component 2 full methodology text correct
- [ ] Component 2 epistemic status note displayed
- [ ] Component 3 full content with status note
- [ ] About page updated to v3 content
- [ ] Dashboard intro copy updated
- [ ] THM tooltip updated
- [ ] Panel subtitles updated
- [ ] The Lens callout card on dashboard

**Data and charts**
- [ ] M2 data in DB, 1913–present, auto-updating
- [ ] Real GDP in DB, 1913–present, auto-updating
- [ ] Static seed data committed to repo
- [ ] Three THM series calculated correctly
- [ ] Verification values confirmed (3200 / 4300 / 116000)
- [ ] Dashboard THM line updated to M2GDP basis, no 2%
- [ ] Methodology change note displayed on dashboard
- [ ] Chart 1: three THM lines, log scale, correct labels
- [ ] Chart 2: purchasing power, linear, endpoint labels
- [ ] Chart 3: output deflation gap, log scale
- [ ] Chart 4: stolen deflation, linear scale
- [ ] All charts mobile-responsive
- [ ] All charts match existing design system

**Pre-launch**
- [ ] All Phase 2 checklist items confirmed complete
- [ ] No console errors
- [ ] Staging validated before production deploy
- [ ] Manual DB backup taken before production deploy

---

*Version 3.0 — May 2026*
*Companion documents:*
*CLAUDE.md*
*FreeMarketWatch_Phase2_Briefing.md (Phase 2 — check status)*
*FMW_Site_Architecture.md (structure reference)*
*FMW_Lens_Hub_And_Wrappers.md (Component 1, 2, 3 content)*
*FMW_THM_Methodology_v3.md (Component 2 full text)*
*FMW_About_Page_v3.md (about page content)*
*FMW_Dashboard_Copy_v3.md (all dashboard copy)*
*freeMarketWatch.world*
