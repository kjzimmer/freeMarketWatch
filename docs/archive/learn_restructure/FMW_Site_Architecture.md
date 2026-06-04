# FreeMarketWatch — Site Architecture
## The Lens: Full Structure
### Version 1.0 — May 2026

---

## Site purpose — one paragraph

FreeMarketWatch exists to do two things. First: show financial markets
through an honest lens — THM, Theoretical Hard Money — instead of the
distorted fiat lens every other financial site uses. Second: develop the
framework for how investors should think and act in a world where hard
money is the standard. The first purpose is largely built. The second
is being developed openly, as research, in real time.

---

## Navigation structure

```
Dashboard          → /
The Lens           → /lens
  Component 1      → /lens/fiat          (established)
    Act 1-6        → /lens/fiat/act/:n
  Component 2      → /lens/thm           (established + open questions)
  Component 3      → /lens/investing     (theoretical, in progress)
About              → /about
Contact            → /contact
```

---

## The Lens — section overview

The Lens is the intellectual foundation of the site. Everything on the
dashboard — every chart, every benchmark, every data point — flows from
the arguments made here.

The section has three components, each with a different epistemic status:

| Component | Title | Status |
|-----------|-------|--------|
| 1 | Why the Fiat Lens Distorts | Established — well-developed argument |
| 2 | The THM Lens | Mostly established, genuine open questions |
| 3 | Investing Through the THM Lens | Theoretical — actively being developed |

The distinction between established and in-progress is made explicit
on the hub page and on each component landing page. The site does not
pretend to have answers it doesn't have.

---

## Component 1: Why the Fiat Lens Distorts

**Route:** `/lens/fiat`
**Status:** Established

Content: the six-act series "From Trade to Bitcoin: The Case for Sound
Money" — unchanged. A wrapper introduction frames it as the first
component of The Lens. A closing transition moves readers to Component 2.

Six acts:
1. Why money exists — and why it matters more than you think
2. What makes good money — and what makes it a weapon
3. What bad money does to the world — the blast radius
4. Hard money changes everything — including how you think
5. Bitcoin — the answer to the question gold could not solve
6. What you now understand — and what comes next

---

## Component 2: The THM Lens

**Route:** `/lens/thm`
**Status:** Established framework, open questions on methodology

Content: the THM methodology discussion — what THM is, why it is the
right benchmark, and how to calculate it. Three approaches examined
honestly. THM_M2GDP adopted as the primary benchmark. THM_M2 presented
as the philosophically purest approach and an open dialog.

Subsections:
- Why THM is the whole point of this site
- Three approaches to calculating debasement
  - Inflation indexes (CPI — familiar but flawed)
  - M2/GDP (primary benchmark — theoretically grounded)
  - Raw M2 (Austrian ideal — honest about its limits)
- The output deflation gap — what the difference between M2 and M2/GDP means
- The eurodollar problem — why even M2 understates true debasement
- Where we are and what we're asking (open dialog invitation)

Charts: four research charts showing the three THM lines, purchasing
power decline, the output deflation gap, and the stolen deflation series.

---

## Component 3: Investing Through the THM Lens

**Route:** `/lens/investing`
**Status:** Theoretical — in active development

Content: how investing logic changes under hard money assumptions.
What information matters. What the dashboard needs to show.

Theory sections (draft in this document):
- The base position changes
- What you are actually looking for
- How debt works differently
- What information THM investors need
- Dashboard implications (flagged as work in progress)

---

## Dashboard changes implied by this architecture

- THM line: switch from CPI-based to M2/GDP-based, remove 2%
  productivity addition
- Dashboard intro copy: updated to reference The Lens
- THM line tooltip: updated to explain M2/GDP basis
- Toggle: show all three THM lines as a research toggle (after
  Component 2 research charts are validated)

---

*Version 1.0 — May 2026*
*freeMarketWatch.world*
