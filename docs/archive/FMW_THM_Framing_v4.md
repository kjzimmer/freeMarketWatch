# FreeMarketWatch — Content Updates
## THM Framing: Output Growth / Monetary Expansion Decomposition
## Version 4 — final, ready for CC implementation
### June 2026

---

## Status

This is Version 1 of the THM methodology framing. It is internally
coherent, mathematically verified, and defensible against serious
economic criticism. It is not the last word — alternative benchmarks
and correlation testing are identified as future research. But it is
ready to publish.

The threshold crossed: a skeptical economist can no longer dismiss
the argument on logical grounds. The debate moves from "your logic
doesn't make sense" to "are your assumptions useful?" That is the
right place to be at launch.

---

## What changes and what doesn't

The numbers do not change. The formula does not change. The charts
do not change. No code changes required — content only.

Two files updated: LensTHM.tsx and docs/FMW_Vision.md.

**Three corrections from v3:**
1. Purchasing power claim softened from assertion to research question
2. THM name given explicit, defensible meaning without overclaiming
3. "Primary driver" language replaced with candidate explanation framing

**Mathematical verification (unchanged from v2/v3):**
```
THM(t) = 100 × (M2_t / GDP_t) / (M2_0 / GDP_0)

Verified: THM × Dollar = 100² at every period.
Step-by-step decomposition matches direct formula exactly.
```

---

## Update 1 — /lens/thm (LensTHM.tsx)

### Replace the "The underlying framework" section with:

---

## The underlying framework

Before examining three ways to calculate THM, it helps to understand
what the calculation is actually isolating — and what it is not.

### Two observable forces

Every period, two things happen simultaneously in the economy:

**Monetary Expansion:** The money supply (M2) grows. More monetary
claims are issued. Each existing dollar represents a smaller share
of total output. This is the Monetary Expansion Factor —
M2_t / M2_(t-1).

**Output Growth:** The real economy expands or contracts. GDP rises
with more workers, more capital, more productive activity. This is
the Output Growth Factor — GDP_t / GDP_(t-1).

These two forces are observable and separable. One clarification
on the labels: the Output Growth Factor is simply GDP growth. It
does not isolate productivity or efficiency — it includes population
growth, capital accumulation, government spending, and genuine
productivity gains alike. We label it Output Growth because that
is what the math measures, nothing more.

```
Monetary Expansion Factor(t) = M2_t / M2_(t-1)
Output Growth Factor(t)      = GDP_t / GDP_(t-1)

Monetary Intensity:
MI_t = M2_t / GDP_t
(monetary claims per unit of real output)

MI rises when money supply grows faster than output.
MI falls when output grows faster than money supply.
```

A note on existing economic concepts: economists familiar with
the quantity theory of money will recognize that GDP/M2 is broad
money velocity. THM is related to velocity but the interpretation
differs. Velocity is typically framed as money turnover. We frame
M2/GDP as monetary claims per unit of output — a different lens
on the same ratio. We flag this because a careful economist will
raise it.

### What THM measures

THM is a monetary intensity benchmark. It measures how much
monetary claims have grown relative to real output — the
accumulated excess of Monetary Expansion over Output Growth,
compounded from 1913.

```
THM_(t) = THM_(t-1) × (Monetary Expansion Factor / Output Growth Factor)

Compounded from 1913:
THM(t) = 100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)
```

This is the formula implemented on the dashboard. The decomposition
is not a new model — it is a more careful description of what the
existing formula computes. M2/GDP is not an arbitrary choice. It
emerges from the ratio of two observable growth rates. The
decomposition is the explanation.

**What this means for the chart:** THM rises when Monetary Expansion
outpaces Output Growth. The rising THM line is the accumulated
excess. For an asset to genuinely preserve value relative to this
benchmark, it must keep pace with the rate at which monetary claims
have grown above output.

### What THM is — and what it is not

THM stands for Theoretical Hard Money. The name reflects the
benchmark's intent: to isolate and quantify the monetary-intensity
dimension that distinguishes hard money from fiat. It is a
defensible attempt at that isolation, not a simulation of what
hard money would have been.

A hard money system has one defining characteristic: the supply
of monetary claims does not expand relative to economic output.
M2/GDP captures exactly that dimension. Under a fixed supply,
M2/GDP falls as output grows. Under fiat, it has risen. THM
tracks that difference — accumulated from 1913.

What THM does not claim to be:

- A simulation of what would have happened under a gold standard
- A simulation of what would have happened under Bitcoin
- The closest possible approximation to hard money
- A proof that any particular monetary system is superior

What THM is:

- A benchmark that isolates the monetary-claims-versus-output
  dimension of hard money
- A transparent, reproducible signal derived from two observable
  inputs: M2 and GDP
- A Version 1 model that is internally coherent and open to
  refinement as alternative benchmarks are explored

### What would happen under a fixed money supply

In a fixed supply world — as Bitcoin's supply is fixed —
Monetary Expansion equals 1 every period. M2 does not grow.

Output Growth continues. With M2 fixed and GDP rising, Monetary
Intensity (M2/GDP) falls. THM would *decline* as GDP grows:

```
Fixed supply:
M2 = constant → Monetary Expansion Factor = 1 each period
GDP grows 3%/yr → Output Growth Factor = 1.03

THM change each period = 1 / 1.03 ≈ −2.9%/yr
```

A falling THM under fixed supply is the correct and expected
result — monetary intensity declining as output grows against
a fixed supply. This is the natural monetary environment of a
hard money world: more output per unit of money, prices gently
falling, purchasing power of each unit rising.

Under fiat, the opposite occurred. Money supply grew faster
than output, monetary intensity rose, and THM climbed steeply.

**Important clarification:** THM as implemented is a debasement
benchmark — it rises with monetary intensity. It is not a
simulation of what a hard money holder accumulates. The name
THM refers to the monetary standard the benchmark is designed
to represent — not to the direction the line moves. This
distinction is real and worth holding clearly.

### What the Dollar series measures

The Dollar is the exact inverse of THM:

```
Dollar(t) = 100² / THM(t)
```

The gap between THM and the Dollar at any point is precisely
and entirely the accumulated excess of Monetary Expansion over
Output Growth. Not an interpretation — a mathematical identity.

### Purchasing power — what the decomposition explores

Monetary intensity (M2/GDP) is one candidate explanation for
long-run changes in purchasing power — what money can actually
buy. This model explores whether changes in monetary intensity
correspond to observed changes in purchasing power over long
periods.

We do not claim the decomposition proves this relationship. We
present it as a research question: does this signal correspond
to what people actually experienced? The 111-year chart is the
evidence. The interpretation follows from the data.

We flag this distinction because a careful economist would raise
it correctly: purchasing power strictly requires a price index.
This decomposition derives from M2 and GDP. Whether monetary
intensity is a useful proxy for purchasing power is an empirical
question, not an algebraic one.

### The research question

This decomposition does not prove Austrian economics. It does
not claim M2/GDP is the only valid measure of debasement. It
does not assert that monetary expansion is always harmful.

It asks one empirical question: **does this decomposition
produce a stable and interpretable signal across 111 years
of historical data?**

If Monetary Intensity tracks recognizable monetary events —
accelerates after 1971 when gold convertibility ended, spikes
during COVID money printing, contracts during tight money
periods — the decomposition has empirical content. If the gap
between THM and the Dollar corresponds to what people
experienced as purchasing power loss, the model is useful.

The charts below show the historical record. The
interpretation follows from the data, not from the framework.

### What comes next

Version 1 uses M2/GDP as the single benchmark. Alternative
benchmarks are the logical next step:

- **Monetary Base / GDP:** base money instead of M2 — a
  robustness test on the money definition
- **Total Credit / GDP:** credit expansion may capture
  debasement effects M2 misses
- **Total Debt / GDP:** how much future output has already
  been pledged
- **Broad Liquidity / GDP:** shadow banking and offshore
  dollar effects

If multiple benchmarks point in the same direction, the
thesis strengthens. If they diverge, something important
is learned. We treat Version 1 as the foundation, not
the final word.

---

*(The three approaches section follows here — unchanged)*

---

## Update 2 — FMW_Vision.md

### Replace the "How THM is calculated" subsection with:

---

### How it is calculated — Version 1

THM is constructed by decomposing economic history into two
separable and observable forces:

**Monetary Expansion:** Each period, the money supply (M2) grows.
More monetary claims are issued per unit of real output. Monetary
Intensity — M2/GDP — rises.

**Output Growth:** Each period, the real economy expands. GDP growth
includes population growth, capital accumulation, and productivity
gains together. When GDP grows faster than M2, Monetary Intensity
falls. When M2 grows faster than GDP, it rises.

THM accumulates the ratio of Monetary Expansion to Output Growth,
compounded from 1913:

```
THM(t) = 100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)
```

This is what is implemented on the dashboard. The decomposition
explains where the formula comes from: the ratio of two observable
growth rates. M2/GDP is not an arbitrary choice — it emerges from
the decomposition.

**What THM is:** a benchmark that isolates and quantifies the
monetary-intensity dimension that distinguishes hard money from
fiat. It is a defensible attempt at that isolation, not a
simulation of what hard money would have been.

Hard money has one defining characteristic: monetary claims do
not expand relative to economic output. M2/GDP captures exactly
that dimension. Under a fixed supply, M2/GDP falls as output
grows. Under fiat, it has risen. THM tracks that difference.

**Under a fixed money supply** — as Bitcoin's supply is fixed —
Output Growth continues but M2 stays constant. Monetary Intensity
falls. THM would decline at the real output growth rate. That
falling line is the natural environment of a hard money world:
more output per unit of money, prices gently falling, purchasing
power of each unit rising. Under fiat, the reverse occurred.

**The Dollar** is the exact mathematical inverse of THM. The gap
between them at any point is precisely the accumulated excess of
Monetary Expansion over Output Growth — verified algebraically
and numerically.

**Purchasing power:** monetary intensity is one candidate
explanation for long-run changes in purchasing power. This model
explores whether changes in M2/GDP correspond to observed changes
in purchasing power over long periods. We present it as a research
question, not a proof. The 111-year chart is the evidence.

**Version 1** uses M2/GDP as the single benchmark. Alternative
benchmarks — Monetary Base/GDP, Total Credit/GDP, Total Debt/GDP
— are identified as future research. If multiple measures point
in the same direction, the thesis strengthens. If they diverge,
something important is learned. We treat this as the foundation,
not the final word.

The full methodology — including the three-method comparison,
honest open questions, and the historical charts — is on The
THM Lens page.

---

## Implementation notes for CC

Content-only changes. No code, no formula, no data changes.

Files to update:
1. `client/src/pages/LensTHM.tsx` — replace "The underlying
   framework" section with Update 1 above
2. `docs/FMW_Vision.md` — replace "How THM is calculated"
   subsection with Update 2 above

After updating, also update `docs/CLAUDE.md` to note:
- THM is described as a monetary intensity benchmark (Version 1)
- Purchasing power is presented as a research question,
  not a measurement claim
- Alternative benchmarks are identified as future research

Owner will reload updated docs into project knowledge base.

---

## Definition of done

- [ ] LensTHM.tsx underlying framework section updated
- [ ] FMW_Vision.md How THM is calculated section updated
- [ ] CLAUDE.md THM description updated to reflect v4 framing
- [ ] No remaining instances of "primary driver of purchasing
      power" as an assertion (search codebase)
- [ ] No remaining instances of "closest possible approximation
      to hard money" (search codebase)
- [ ] Updated docs/FMW_Vision.md and docs/CLAUDE.md provided
      to owner for reload into knowledge base

---

## What this version does not address (future research)

Per the extended methodology discussion, the following are
identified as Version 2 and beyond:

- Alternative benchmarks: Monetary Base/GDP, Total Credit/GDP,
  Total Debt/GDP, Broad Liquidity/GDP
- Robustness testing across benchmark variants
- Correlation testing: does THM lead CPI, gold, housing,
  Bitcoin over various time horizons?
- Predictive relationship analysis

These are not deferred because they are unimportant. They are
deferred because Version 1 must be published and exposed to
real criticism before Version 2 is designed. The next stage
is not more theorizing — it is seeing what happens when
readers try to break the model.

---

*Version 4 — final, ready for CC implementation*
*June 2026*
*freeMarketWatch.world*
ENDDOC
echo "v4 written"