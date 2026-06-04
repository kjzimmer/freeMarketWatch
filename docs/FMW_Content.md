# FreeMarketWatch — Content Inventory
## June 2026

---

## Route and Page Inventory

| Route | Page / Component | Status | Content type | Notes |
|-------|-----------------|--------|--------------|-------|
| `/` | Dashboard | **Live** | Live data + static copy | Three chart panels (currency, riskoff, riskon); 1/5/10Y window selector; BTC toggle; THM change notice (dismissable); collapsible THM explainer; Lens callout card |
| `/about` | About | **Live** | Static | Site mission, how to read the charts, methodology note, data sources, what's next; links to `/lens` and `/lens/thm` |
| `/contact` | Contact | **Live** | Static + form | Contact form; links to education series |
| `/lens` | The Lens Hub | **Live** | Static | Three-column layout; cards for each Lens component with status badges (Established / Open questions / In development) |
| `/lens/fiat` | Why the Fiat Lens Distorts | **Live** | Static | Intro text; six act-summary cards; closing transition to `/lens/thm`; downloads section |
| `/lens/fiat/act/1` | Act 1: Why Money Exists | **Live** | Static | Paragraph, stat-cards, pullquote, coming-next blocks |
| `/lens/fiat/act/2` | Act 2: What Makes Good Money | **Live** | Static | Paragraph, property-grid, comparison-table blocks |
| `/lens/fiat/act/3` | Act 3: The Blast Radius | **Live** | Static | Paragraph, comparison-table, insight-blocks |
| `/lens/fiat/act/4` | Act 4: Hard Money Changes Everything | **Live** | Static | Paragraph, four-cards, two-col-table blocks |
| `/lens/fiat/act/5` | Act 5: Bitcoin | **Live** | Static | Paragraph, comparison-matrix, faq-blocks, book-cards |
| `/lens/fiat/act/6` | Act 6: What Comes Next | **Live** | Static | Paragraph, cta-panels blocks |
| `/lens/thm` | The THM Lens | **Live** | Static + live charts | Full v3 methodology text; four Recharts research charts (three THM variant lines, purchasing power of dollar, output deflation gap, stolen deflation); links to `/lens/investing` |
| `/lens/investing` | Investing Through the THM Lens | **Live** | Static | Six sections of investing framework theory; five investment criteria cards; dashboard implications section (explicitly marked work in progress) |

### Legacy redirects (no page rendered)

| Route | Redirects to |
|-------|-------------|
| `/learn` | `/lens` |
| `/learn/thm` | `/lens/thm` |
| `/learn/sound-money` | `/lens/fiat` |
| `/learn/sound-money/act/:n` | `/lens/fiat/act/:n` |
| `/learn/act/:n` | `/lens/fiat/act/:n` |

---

## Content Source Legend

| Source label | Meaning |
|---|---|
| CC-authored | Written by Claude Code based on owner direction and briefing documents |
| Owner content | Educational/narrative content written or provided by the owner |
| Live data | Rendered from API calls to the Express backend (ultimately from FRED, CryptoCompare, Yahoo Finance) |
| Static | Hardcoded in the React component; no backend dependency |

---

## Content Sources by Page

| Route | Source |
|-------|--------|
| Dashboard | Live data (purchasing power series from DB); static copy CC-authored (v3 briefing) |
| About | CC-authored (v3) |
| Contact | CC-authored |
| `/lens` hub | CC-authored (v3) |
| `/lens/fiat` wrapper | CC-authored intro and structure; act summaries derived from act content |
| Acts 1–6 | Owner content (in `client/src/content/acts.ts`) |
| `/lens/thm` | CC-authored from owner methodology; live charts from `/api/learn/thm-charts` |
| `/lens/investing` | CC-authored (v3) |

---

## Orphaned or Unused Files

| File | Status | Note |
|------|--------|------|
| `client/src/pages/LearnTHM.tsx` | Legacy — not routed | Superseded by `LensTHM.tsx`; old `/learn/thm` page |
| `client/src/pages/LearnSoundMoney.tsx` | Legacy — not routed | Superseded by `LensFiat.tsx`; old `/learn/sound-money` page |
| `client/src/content/topics.ts` | Unused — not referenced in UI | Glossary-style topic list; routes updated to `/lens/*` but not rendered anywhere |

---

## Briefed but Not Yet Implemented

The following items appear in briefing documents or are referenced in current site copy as "in progress" or "planned":

**Dashboard THM toggle**
The THM methodology page shows three different THM definitions (CPI, M2/GDP, M2RAW). A planned dashboard feature would let users switch between these definitions to see how the choice affects the chart. Not built; dashboard uses M2/GDP only.

**MM / Cash instrument**
The Money Market (MM) instrument is registered in `market_instruments` and mentioned in the DrillDownModal as "data pending." Converting a rate series (FRED TB3MS 3-month T-bill) to a comparable purchasing-power index requires additional conversion logic. Not yet implemented.

**Component 3 investing tools**
The `/lens/investing` page describes what a THM-based investment analysis tool would show (real revenue growth, debt burden under hard money assumptions, productivity screens). These dashboard tools are explicitly flagged as work in progress on the page; the theoretical framework is live, the data tooling is not.

**Additional instruments**
The schema and fetch infrastructure support adding more currencies, commodities, and asset classes. The currently active instruments are the 19 tickers listed in `market_instruments`.

**Download files**
The `/lens/fiat` page links to downloadable files (one PDF, seven PPTX) at `/downloads/FreeMarketWatch_Education_SixActs_v1.2.pdf` and similar paths. These files are not confirmed to exist in `client/public/downloads/`. If they do not exist, the download links are broken.

**Bitcoin-as-mature-monetary-standard framing — IMPLEMENTED**
The framing that THM represents what Bitcoin looks like as a mature monetary standard (adoption phase factored out) is now live in three places: THMExplainer on the dashboard (fixed supply → natural deflation → M2/GDP approximation), About page (two-point founding premise, second point explicitly states this), and LensTHM ("Why THM and Bitcoin are the same question" section with six paragraphs). This item is complete.

---

## SEO / Prerendering

Static content pages are prerendered at build time. The dashboard (`/`) is excluded — live charts require client-side data fetching.

| Route | Prerendered | Per-page title + description |
|-------|-------------|------------------------------|
| `/` | No (SPA, live data) | Generic (from `index.html`) |
| `/about` | Yes | "About \| Free Market Watch" |
| `/contact` | Yes | "Contact \| Free Market Watch" |
| `/lens` | Yes | "The Lens \| Free Market Watch" |
| `/lens/fiat` | Yes | "Why the Fiat Lens Distorts \| Free Market Watch" |
| `/lens/fiat/act/1` – `/act/6` | Yes | "Act N: [Title] \| Free Market Watch" |
| `/lens/thm` | Yes | "The THM Lens \| Free Market Watch" |
| `/lens/investing` | Yes | "Investing Through the THM Lens \| Free Market Watch" |

`robots.txt` and `sitemap.xml` are in `client/public/`. Sitemap lists all 13 routes including `/`. Crawlers on prerendered routes receive fully populated HTML; crawlers on `/` receive the SPA shell (React renders client-side after JS loads).

---

*FreeMarketWatch · June 2026*
*Companion documents: FMW_Vision.md, FMW_Architecture.md, CLAUDE.md*
