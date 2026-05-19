# WEBDESIGN_SKILL.md — FreeMarketWatch Design System

> Claude Code must read this file before writing any frontend code, styling, or UI components. This is the design authority for the project. Deviation requires explicit user approval.

---

## Design Philosophy

FreeMarketWatch is a **serious data tool with a distinctive visual identity**. It is not a crypto hype site, not a Bloomberg terminal clone, and not a generic SaaS dashboard.

The aesthetic is: **deep-space data observatory** — as if someone built an instrument to see financial reality that is normally hidden. Dark, precise, intentional. Every element earns its place.

The emotional register: **clarity with gravitas**. The data reveals something most people don't know and should. The design amplifies that revelation without sensationalizing it.

**One rule above all others:** Let the data speak. The UI is the frame, not the painting.

---

## Color System

```css
:root {
  /* Backgrounds */
  --bg-base:        #060810;   /* deep space — main background */
  --bg-surface:     #0d1117;   /* card/panel background */
  --bg-elevated:    #131922;   /* modals, dropdowns */
  --bg-subtle:      rgba(255,255,255,0.03);

  /* Borders */
  --border-default: rgba(255,255,255,0.07);
  --border-subtle:  rgba(255,255,255,0.04);
  --border-accent:  rgba(168,255,120,0.25);

  /* Brand accents */
  --thm-green:      #a8ff78;   /* THM line — primary brand color */
  --thm-green-dim:  rgba(168,255,120,0.12);
  --btc-orange:     #f7931a;   /* Bitcoin */
  --btc-orange-dim: rgba(247,147,26,0.10);

  /* Text */
  --text-primary:   #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted:     #475569;
  --text-faint:     #1e293b;

  /* Semantic */
  --gain:           #4ade80;   /* above THM — outperforming */
  --loss:           #f87171;   /* below THM — underperforming */
  --neutral:        #94a3b8;

  /* Chart series colors — each ticker has a fixed color */
  --color-thm:      #a8ff78;
  --color-btc:      #f7931a;
  --color-usd:      #60a5fa;
  --color-eur:      #818cf8;
  --color-jpy:      #f472b6;
  --color-gbp:      #34d399;
  --color-cny:      #fb923c;
  --color-tlt:      #94a3b8;
  --color-gld:      #fbbf24;
  --color-tips:     #a78bfa;
  --color-mm:       #38bdf8;
  --color-cash:     #64748b;
  --color-aapl:     #f87171;
  --color-msft:     #4ade80;
  --color-googl:    #facc15;
  --color-amzn:     #fb923c;
  --color-nvda:     #c084fc;
  --color-meta:     #60a5fa;
  --color-tsla:     #f472b6;
}
```

**Color rules:**
- Never use pure black (#000) or pure white (#fff)
- THM green is sacred — do not use it for anything other than the THM line and primary brand elements
- Chart series colors are fixed per ticker — never change them, users build visual memory
- Gain/loss semantic colors apply to endpoint summary numbers only, not chart lines

---

## Typography

```css
/* Import in index.html or global CSS */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --font-display: 'Syne', sans-serif;      /* headings, labels, UI */
  --font-data:    'JetBrains Mono', monospace;  /* numbers, tickers, values */
}
```

**Usage rules:**
- `Syne` for all headings, navigation, panel titles, button labels
- `JetBrains Mono` for all numeric data, ticker symbols, percentages, dates, methodology text
- Never mix in a third font family without user approval
- Font sizes: headings 22-32px, panel titles 15-18px, data labels 10-13px, body 13-14px
- Font weights: Syne 800 for hero, 700 for panel titles, 600 for subheadings, 400 for body
- Letter spacing: +0.04em on panel titles, +0.12-0.18em on uppercase labels and tickers
- Line height: 1.1 for headings, 1.6-1.7 for body/methodology text

---

## Spacing & Layout

```
Base unit: 4px
Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64

Page padding:     40px horizontal (desktop), 20px (mobile)
Panel gap:        20px
Panel padding:    24px 28px
Header height:    ~100px
```

**Layout rules:**
- Three panels in a responsive grid: `repeat(auto-fit, minmax(420px, 1fr))`
- On mobile (< 768px): single column
- On tablet (768-1100px): two columns (currencies + risk-off), risk-on full width
- On desktop (> 1100px): three columns equal width
- Chart height: 260px fixed (ensures consistent visual weight across panels)
- Never let charts exceed their container or overflow horizontally

---

## Chart Design (Recharts)

### Required elements on every chart
```tsx
<LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
  <XAxis ... />
  <YAxis ... />
  <Tooltip content={<CustomTooltip />} />
  <ReferenceLine y={100} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
  {/* THM always first, always dashed */}
  <Line dataKey="THM" strokeDasharray="6 3" strokeWidth={2.5} dot={false} />
  {/* All others */}
  <Line ... strokeWidth={1.5} dot={false} />
</LineChart>
```

### THM line treatment
- Always dashed: `strokeDasharray="6 3"`
- Always slightly thicker: `strokeWidth={2.5}` vs `1.5` for others
- Always lime green: `stroke="var(--thm-green)"`
- Always rendered first (bottom of stack) so others overlay it

### Axis styling
```tsx
// X axis
tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
tickLine={false}

// Y axis
tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
axisLine={false}
tickLine={false}
tickFormatter={v => v.toFixed(0)}
```

### Custom tooltip
- Dark background: `rgba(10,12,18,0.95)`
- Border: `1px solid rgba(168,255,120,0.2)`
- Border radius: 8px
- Font: JetBrains Mono, 12px
- Show all series sorted by current value descending
- Each row: series name left, indexed value right, colored by series color
- Footer: small muted label "Index (start = 100)"

### Log scale toggle
- Every panel has a log scale toggle (small, top-right of chart area)
- Default: linear
- Especially important for panels containing BTC or NVDA
- Toggle label: "LOG" / "LIN" in JetBrains Mono, muted until active

### Endpoint summary (below each chart)
- Sorted by final value descending
- Each item: colored dot + ticker + % change from 100
- Green if ≥ 100 (var(--gain)), red if < 100 (var(--loss))
- Font: JetBrains Mono 10px
- Layout: flex-wrap row

---

## Component Patterns

### Panel card
```tsx
<div style={{
  background: 'linear-gradient(135deg, rgba(15,20,30,0.9), rgba(10,14,22,0.95))',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '24px 28px 20px',
}}>
```

### Methodology button (top-right of each panel)
```tsx
<button style={{
  background: 'var(--thm-green-dim)',
  border: '1px solid var(--border-accent)',
  borderRadius: 6,
  color: 'var(--thm-green)',
  fontSize: 11,
  padding: '4px 10px',
  fontFamily: 'var(--font-data)',
  cursor: 'pointer',
}}>
  methodology ↗
</button>
```

### Primary toggle (BTC classification)
This is a featured educational element — not a subtle setting:
```tsx
// Prominent placement in header
// Label: "Treat Bitcoin as:"
// Options: [ Currency ] [ Risk-On Asset ]
// Active option: THM green border + dim green background
// Inactive: muted border, gray text
// Below toggle: small italic note "Two schools of thought — see methodology"
```

### Timeframe selector (1Y / 5Y / 10Y)
```tsx
// Three buttons, grouped
// Active: green border, green text, dim green bg
// Inactive: muted border, gray text
// Font: JetBrains Mono
// Apply to all panels simultaneously
```

### Drill-down modal
```tsx
<div style={{
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
}}>
  <div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-accent)',
    borderRadius: 12,
    padding: 32,
    maxWidth: 560,
    width: '90%',
    fontFamily: 'var(--font-data)',
    maxHeight: '80vh',
    overflowY: 'auto',
  }}>
    {/* Sections: Data Sources, Calculation Method, Limitations, Last Updated */}
  </div>
</div>
```

---

## Ambient Visual Effects

### Page background
```css
background: var(--bg-base);
background-image:
  radial-gradient(ellipse 80% 40% at 50% -10%,
    rgba(168,255,120,0.06) 0%, transparent 70%),
  radial-gradient(ellipse 60% 30% at 80% 100%,
    rgba(247,147,26,0.04) 0%, transparent 60%);
```

### THM indicator dot (header)
```css
width: 10px; height: 10px;
border-radius: 50%;
background: var(--thm-green);
box-shadow: 0 0 10px var(--thm-green);
/* Subtle pulse animation */
animation: pulse 3s ease-in-out infinite;

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 10px var(--thm-green); }
  50% { opacity: 0.7; box-shadow: 0 0 20px var(--thm-green); }
}
```

### Scrollbar
```css
::-webkit-scrollbar { width: 4px; background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: rgba(168,255,120,0.2); border-radius: 2px; }
```

---

## Header Structure

```
┌─────────────────────────────────────────────────────────────┐
│  ● FREE MARKET WATCH              [1Y] [5Y] [10Y]           │
│                                                             │
│  Purchasing Power                 Treat Bitcoin as:         │
│  as the universal benchmark       [Currency] [Risk-On]      │
│                                   Index: 100 = start · ╌ THM│
├─────────────────────────────────────────────────────────────┤
│  THM explainer bar (collapsible)                            │
└─────────────────────────────────────────────────────────────┘
```

The THM explainer bar:
- Background: `rgba(168,255,120,0.04)`, border: `var(--border-accent)`
- One paragraph explaining THM and the 2% figure
- Collapsible (default: expanded on first visit, collapsed after)
- Font: JetBrains Mono 11px, color: var(--text-muted)

---

## Data States

Every data-driven component must handle:

```tsx
// Loading
<div style={{ height: 260, display: 'flex', alignItems: 'center',
  justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-data)',
  fontSize: 12 }}>
  fetching data...
</div>

// Error
<div style={{ color: 'var(--loss)', fontSize: 12, fontFamily: 'var(--font-data)' }}>
  data unavailable — {error.message}
</div>

// Empty (BTC before 2009 in a 1Y window starting pre-2009)
// Render the line from when data begins, with a label indicating start date
```

---

## What Not To Do

- No purple gradients, no glass morphism blur, no neon glow overload
- No animations on chart lines themselves (they're data, not decoration)
- No skeleton loaders that look like content — use simple text loading states
- No tooltips that cover the chart area
- No horizontal scrolling on any viewport
- No more than 3 font weights in use at once
- No color outside the defined palette without user approval
- No decorative elements that compete with the data for attention
- Never show a chart without its methodology button
- Never show data without its source disclosed somewhere accessible

---

## Responsiveness Checklist

Before considering any component done:
- [ ] Renders correctly at 375px (iPhone SE)
- [ ] Renders correctly at 768px (tablet)
- [ ] Renders correctly at 1440px (desktop)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Chart tooltips work on touch (tap, not hover)
- [ ] BTC toggle and timeframe selector are reachable on mobile
- [ ] Modal is scrollable on mobile if content overflows

---

*This skill is specific to FreeMarketWatch. For general frontend design principles, see the public frontend-design skill.*
*Last updated: May 2026*
