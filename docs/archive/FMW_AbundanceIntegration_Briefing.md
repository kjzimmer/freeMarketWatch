# FreeMarketWatch — CC Briefing
## Planting Seeds: Architecture of Abundance Integration
### June 2026

*Read CLAUDE.md, FMW_Architecture.md, and FMW_Content.md before starting.*
*This briefing covers two content additions: Act 6 closing section and*
*Lens Hub "What This Points Toward" section.*
*No new routes. No schema changes. Content updates only.*

---

## Context

FreeMarketWatch presents the analytical case for hard money and Bitcoin.
A companion site — **abundancearchitecture.world** — addresses the
community-level question: what do you actually build once you understand
the problem? The two sites serve different audiences at different stages
of the same journey.

FreeMarketWatch's role is to plant seeds — to make the community
dimension visible at the natural conclusion of the analytical journey,
without becoming responsible for developing it. The reader who completes
the Lens has earned the next horizon. These additions name it.

**Tone guidance (critical):**
These additions must feel like a natural continuation of the existing
voice — analytical, non-preachy, structurally honest. They do not
recruit. They do not advocate. They describe what follows from
understanding, and point outward. Read the existing Act 6 content
and LensHub copy before writing a single line.

---

## Part 1 — Act 6 Addition (`/lens/fiat/act/6`)

### 1.1 What exists

Act 6 currently ends with two CTA panels:
- Left: "Watch the system live" → `/dashboard`
- Right: "Find your community" → placeholder

The "Find your community" panel is a placeholder. This briefing
replaces it with real content and adds a closing section above the
CTA panels.

### 1.2 New closing section — insert ABOVE the existing CTA panels

This section follows the final paragraph of Act 6's main content
and precedes the CTA panels. It is a `paragraph` block followed
by a `three-level` block (new block type — see 1.4).

---

**Paragraph block (standard prose block, existing style):**

Understanding the monetary system changes what you see. It also
changes what you can build.

The extraction mechanism described across these six acts operates
at scale because most people never learn to name it. Communities
that do — that understand where the value goes and why — can
begin making decisions that don't feed that mechanism. Not through
protest. Not through political action. Through the deliberate
construction of economic relationships built on a different
foundation.

This is not a distant possibility. It is already happening, in
forms that range from individual savings decisions to community
exchange networks to nation-state monetary policy. The common
thread is not ideology. It is understanding — and the choices
that follow naturally from it.

Decentralization is not a political position. It is what emerges
when enough people in a community understand the extraction
mechanism and choose to build their exchange on a foundation
that doesn't contain it.

---

**Three-level block (new block type — see 1.4):**

Title: "Three levels of response"

Level 1:
Label: "Individual"
Body: "Hard money savings. Honest measurement of your own financial
position against a benchmark that doesn't shrink. The dashboard
is the starting point."
Link: { text: "Go to Dashboard →", href: "/dashboard" }

Level 2:
Label: "Community"
Body: "Circular economies — local exchange networks built on hard
money principles. Communities where work and savings hold their
value. Where the honest person is not systematically disadvantaged.
Architecture of Abundance explores this in depth."
Link: { text: "abundancearchitecture.world →", href: "https://abundancearchitecture.world", external: true }

Level 3:
Label: "Systemic"
Body: "Bitcoin as a monetary transition — not a trading opportunity
but a fundamental change in what money is and who controls it.
The adoption index tracks how far along that transition the world
actually is."
Link: { text: "Bitcoin Adoption Index →", href: "/lens/adoption" }

---

### 1.3 Update the existing "Find your community" CTA panel

Replace the placeholder right CTA panel with:

```
Title: "Go deeper"
Body: "The community question — what to build once you understand
the problem — is explored at Architecture of Abundance."
Link: { text: "abundancearchitecture.world →",
        href: "https://abundancearchitecture.world",
        external: true }
Style: same as existing left CTA panel
```

### 1.4 New block type: `three-level`

This block type does not currently exist in the act renderer.
Add it to `LearnAct.tsx` (the act block renderer).

**Rendered structure:**
```
[Section title — "Three levels of response" — Syne, 18px, text-primary]

[Three cards, horizontal on desktop / stacked on mobile]
  Each card:
  - Label: JetBrains Mono, 11px, uppercase, letter-spacing 0.12em,
    THM green (#a8ff78)
  - Body: 14px, text-secondary (#94a3b8), line-height 1.7
  - Link: JetBrains Mono, 12px, THM green, arrow →
    External links open in new tab (target="_blank" rel="noopener")
  - Card border: var(--border-default)
  - Card background: var(--bg-surface)
  - Border radius: 8px
  - Padding: 20px
```

**Data structure in `acts.ts`:**
```typescript
{
  type: 'three-level',
  title: 'Three levels of response',
  levels: [
    {
      label: 'Individual',
      body: '...',
      link: { text: 'Go to Dashboard →', href: '/dashboard', external: false }
    },
    {
      label: 'Community',
      body: '...',
      link: { text: 'abundancearchitecture.world →',
               href: 'https://abundancearchitecture.world',
               external: true }
    },
    {
      label: 'Systemic',
      body: '...',
      link: { text: 'Bitcoin Adoption Index →',
               href: '/lens/adoption',
               external: false }
    }
  ]
}
```

### 1.5 Update `acts.ts`

In the Act 6 content array in `client/src/content/acts.ts`:

1. Add the new paragraph block (section 1.2 prose) before the
   existing CTA panels block
2. Add the new three-level block after the paragraph block
3. Update the existing CTA panels block — replace the right panel
   ("Find your community") with the updated content from section 1.3

Do not change any other Act 6 content. Do not change Acts 1–5.

---

## Part 2 — Lens Hub Addition (`/lens`)

### 2.1 What exists

`LensHub.tsx` currently shows four component cards in a grid:
1. Why the Fiat Lens Distorts (Established)
2. The THM Lens (Open questions)
3. Investing Through the THM Lens (In development)
4. Bitcoin Adoption Index (In development)

Below the cards there may be closing copy. This briefing adds a
new section BELOW the component cards: "What This Points Toward."

### 2.2 New section — add BELOW the four component cards

**Section heading:**
"What This Points Toward"
Syne, 22px, font-weight 700, text-primary
Margin top: 64px (visual separation from the cards above)

**Intro paragraph:**
```
The Lens makes the current system legible. What you do with that
understanding is a separate question — and a larger one.

Three horizons follow from what the Lens presents. They are not
prescriptions. They are where the logic leads.
```
Style: 15px, text-secondary, max-width 600px, line-height 1.75

**Three horizon blocks — vertical stack, left-border accent style:**

Each block:
- Left border: 2px solid, color varies by horizon (see below)
- Padding left: 20px
- Margin bottom: 32px
- Label: JetBrains Mono, 11px, uppercase, letter-spacing 0.12em
- Heading: Syne, 17px, font-weight 600, text-primary
- Body: 14px, text-secondary, line-height 1.7
- Link: JetBrains Mono, 12px, arrow →

---

**Horizon 1 — Individual**
Border color: `#a8ff78` (THM green)
Label: "FIRST HORIZON"
Heading: "Honest measurement"
Body: "The dashboard gives you a benchmark that doesn't shrink.
Most financial analysis uses the dollar as its unit of measure —
a unit that loses purchasing power every year. Replacing it with
THM changes what you see. Start there."
Link: { text: "Go to the Dashboard →", href: "/dashboard" }

---

**Horizon 2 — Community**
Border color: `#fbbf24` (amber)
Label: "SECOND HORIZON"
Heading: "Circular economies"
Body: "When a community prices, saves, and exchanges in hard money
together, the extraction mechanism loses its grip. This is not a
political project. It is an economic one — built from the bottom
up, one relationship at a time. Architecture of Abundance explores
what that looks like in practice."
Link: { text: "abundancearchitecture.world →",
         href: "https://abundancearchitecture.world",
         external: true }

---

**Horizon 3 — Systemic**
Border color: `#f7931a` (BTC orange)
Label: "THIRD HORIZON"
Heading: "Monetary transition"
Body: "Bitcoin is the first monetary asset in history with a
provably fixed supply, no controlling authority, and the
portability that gold never had. Whether it becomes the foundation
of a new monetary standard is the largest economic question of
this era. The adoption index tracks the answer in real time."
Link: { text: "Bitcoin Adoption Index →", href: "/lens/adoption" }

---

**Closing line (below the three blocks):**
```
These horizons are not independent. Each one makes the next
more possible.
```
Style: 14px, text-muted, italic, margin-top 32px

### 2.3 Implementation in `LensHub.tsx`

Add the new section as a distinct `<section>` element below
the existing component cards grid. Keep the component cards
unchanged. The new section is purely additive.

```tsx
// After the component cards grid:
<section className="lens-horizon-section">
  <h2>What This Points Toward</h2>
  <p className="lens-horizon-intro">...</p>
  <div className="lens-horizon-blocks">
    <HorizonBlock ... />
    <HorizonBlock ... />
    <HorizonBlock ... />
  </div>
  <p className="lens-horizon-close">...</p>
</section>
```

---

## Part 3 — Footer Update (all pages)

### 3.1 Add Architecture of Abundance link to Footer

In `Footer.tsx`, add a new line or section below the existing
navigation links:

```
[existing nav links]

── A companion project ──
Architecture of Abundance  →  abundancearchitecture.world
```

Style: JetBrains Mono, 10px, text-faint (`#1e293b`), centered
External link, opens in new tab.

This is subtle — a breadcrumb, not a promotion. It should feel
like a quiet pointer, not an advertisement.

---

## Part 4 — External Link Handling

All links to `abundancearchitecture.world` throughout the site:
- `target="_blank"`
- `rel="noopener noreferrer"`
- Small external link indicator: `↗` appended to link text
  (JetBrains Mono, same size, same color)

Example:
```tsx
<a href="https://abundancearchitecture.world"
   target="_blank"
   rel="noopener noreferrer">
  abundancearchitecture.world ↗
</a>
```

---

## Part 5 — Sitemap and SEO

No new routes are added. No sitemap changes needed.

The external links to `abundancearchitecture.world` are standard
anchor tags — no SEO implications for FreeMarketWatch.

---

## Part 6 — FMW_Content.md Updates

After implementation, update `docs/FMW_Content.md`:

1. Act 6 row: update Notes column to reflect new blocks:
   "Paragraph, stat-cards, pullquote, coming-next, **three-level**,
   cta-panels blocks; closes with Architecture of Abundance links"

2. Lens hub row: update Notes column:
   "Four-column card grid; **'What This Points Toward' horizon section**
   with three horizons and Architecture of Abundance link"

3. Add to "Briefed but Not Yet Implemented" → mark as implemented
   once live.

---

## Part 7 — Verification Checklist

After implementation, verify:

**Act 6:**
- [ ] New paragraph block renders correctly above CTA panels
- [ ] Three-level block renders correctly — three cards, correct
      labels, correct links
- [ ] Community card links to abundancearchitecture.world, opens
      in new tab, shows ↗
- [ ] Right CTA panel updated — no longer shows placeholder
- [ ] No changes to Acts 1–5
- [ ] Mobile: three-level cards stack correctly

**Lens Hub:**
- [ ] "What This Points Toward" section appears below component cards
- [ ] Three horizon blocks render with correct border colors
- [ ] Amber border on Horizon 2 (Community) — distinct from THM green
- [ ] abundancearchitecture.world link opens in new tab, shows ↗
- [ ] Closing italic line renders correctly
- [ ] Mobile: horizon blocks stack without overflow

**Footer:**
- [ ] Architecture of Abundance link appears on all pages
- [ ] Opens in new tab
- [ ] Visually subtle — does not compete with main nav links

**Cross-browser:**
- [ ] Chrome, Safari, Firefox
- [ ] Mobile viewport (375px)

---

*Briefing complete — June 2026*
*Companion: FMW_Hook_v1.md, FMW_Content.md, CLAUDE.md*
*No schema changes. No new routes. Content additions only.*
