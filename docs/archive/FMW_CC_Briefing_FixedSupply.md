# FreeMarketWatch — CC Briefing
## THM Fixed Supply Framing Correction
### June 2026

---

## Read first

Read CLAUDE.md and docs/FMW_Vision.md before starting.
This is a focused correction — no new features, no code changes.
Three content locations and two documentation files need updating.

---

## The correction

A conceptual imprecision was found in how THM is described across
the site. The current wording implies THM represents a world where
"money supply growth tracks real economic output" — which is actually
the Keynesian M2/GDP framing, not the hard money ideal THM represents.

**The settled position — state this precisely everywhere THM is described:**

Bitcoin, and by definition THM, has a fixed supply that cannot be
expanded by any authority. In a hard money world with a fixed supply
and a growing economy, natural healthy deflation occurs — prices fall
as productivity improves, and the purchasing power of every unit of
money held increases over time. This deflation is not a problem.
It is the correct functioning of sound money.

Rather than assume a fixed deflation rate (the original 2% figure
was an estimate with no empirical grounding), THM uses M2/GDP as
the deflator. M2/GDP measures how much faster the money supply
actually grew than the real economy required. That excess growth
is monetary debasement. The inverse — what purchasing power would
have looked like under a fixed supply — is what THM tracks.
This is not a guess. It is derived from 111 years of real data.

**The tension to acknowledge explicitly:**
THM represents a fixed supply world. It is calculated using M2/GDP.
These are different things — the calculation is an approximation of
what the fixed supply ideal would have produced in observable
purchasing power terms. The approximation is well-grounded: the gap
between raw M2 and M2/GDP over 111 years equals almost exactly the
natural deflation a fixed supply would have delivered. But it is an
approximation, and the site should say so briefly wherever the
methodology is described in depth.

---

## Changes required

### Change 1 — docs/FMW_Vision.md

**Location:** THM section, "What it is" paragraph.

**Current wording (wrong):**
"one in which money supply growth tracks real economic output"

**Replace the full "What it is" paragraph with:**

THM (Theoretical Hard Money) is a synthetic purchasing power index.
It is not a real asset, not a price, and not fetched from any external
source. It is computed from historical data to represent what an honest
monetary system would look like: one in which the money supply is fixed
— cannot be expanded by any authority — so that productivity gains in
the real economy flow through as gradually falling prices, increasing
the purchasing power of every unit of money held.

Bitcoin embodies this ideal: provably fixed supply of 21 million,
no controlling authority, issuance governed by mathematics not policy.
THM represents what Bitcoin looks like as a mature monetary standard
— the destination, with the adoption phase factored out.

We calculate THM using M2/GDP — the ratio of money supply growth
above real economic output. This is an approximation of the fixed
supply ideal: M2/GDP measures how much faster the money supply grew
than the economy required, and the inverse of that excess is what
purchasing power would have looked like under a fixed supply. Rather
than assume a deflation rate, we derive it from 111 years of real
data. The full methodology is in The Lens.

---

### Change 2 — client/src/components/THMExplainer.tsx

**Location:** The paragraph describing what THM represents.

Find any sentence that says "money supply growth tracks real economic
output" or similar and replace with the corrected framing.

**Replace the THM description paragraph with:**

THM represents what money would look like if the supply were fixed
— as Bitcoin's supply is fixed. In a hard money world, productivity
gains flow through as gently falling prices, increasing the purchasing
power of every unit of money over time. That is the natural,
healthy deflation of a sound monetary system.

We calculate THM using M2/GDP: how much faster the money supply
actually grew than the real economy required. That excess is
monetary debasement. The inverse is what purchasing power should
have been. Not a guess — 111 years of real data.

Everything above the THM line is genuinely gaining purchasing power.
Everything below it is losing ground, regardless of what the dollar
price shows.

[How we define THM →]

---

### Change 3 — client/src/pages/LensTHM.tsx

**Location:** The "underlying framework" section added in the
previous revision. Find the paragraph that describes what THM
represents and add the fixed supply / approximation clarification.

After the formula block (GDP/M2 ∝ purchasing power), add:

**For THM:** The money supply is fixed by definition — as Bitcoin's
supply is fixed. No debasement term. The only force acting is real
output growth, which flows through as falling prices and rising
purchasing power. This is natural, healthy deflation: the economy
becoming more abundant per unit of money.

We calculate THM using M2/GDP rather than assuming a fixed deflation
rate. M2/GDP measures the actual excess money creation above what the
real economy required — and its inverse is what purchasing power
would have been under a fixed supply. This is an approximation of
the fixed supply ideal, but a well-grounded one: over 111 years,
the gap between raw M2 and M2/GDP equals almost exactly the natural
deflation a fixed supply would have delivered. It is not a guess.
It is derived from the data.

---

### Change 4 — docs/FMW_Vision.md (Bitcoin framing section)

**Location:** "The Bitcoin framing" section near the end of the doc.

**Current wording** describes the Bitcoin connection but does not
explicitly state that THM and Bitcoin share fixed supply as their
defining property.

**Add at the start of "The Bitcoin framing" section:**

The connection between THM and Bitcoin is not metaphorical. Both
are defined by a fixed supply that no authority can expand. Bitcoin's
21 million cap is enforced by mathematics running on thousands of
independent nodes. THM's fixed supply is the defining assumption
of the benchmark. In both cases, the consequence is the same:
purchasing power can only change through real economic productivity,
not through monetary policy. Natural deflation — prices falling as
the economy grows — is the expected and healthy outcome.

The rest of the section remains as written.

---

### Change 5 — docs/CLAUDE.md

**Location:** Core Concepts — THM section.

**Current wording** of the primary formula description says:
"M2/GDP ratio tracks excess money creation above what the growing
economy required"

**Replace that bullet with:**

- M2/GDP ratio tracks excess money creation above what the real
  economy required. THM represents a fixed supply world — as
  Bitcoin's supply is fixed. M2/GDP is the empirically grounded
  approximation of what purchasing power would have looked like
  under that fixed supply: not a guessed deflation rate, but
  111 years of actual data on how much faster money grew than
  the economy needed.

---

## After making all changes

Update docs/FMW_Vision.md, docs/FMW_Architecture.md, and
docs/CLAUDE.md to reflect current state. The owner will load
the updated docs into the project knowledge base.

Specifically confirm in the updated docs:
- THM "What it is" section uses the fixed supply framing
- The M2/GDP-as-approximation tension is acknowledged
- The Bitcoin connection is stated as a shared fixed supply property
- No remaining references to "money supply growth tracks real
  economic output" in any site copy or documentation

---

## Definition of done

- [ ] docs/FMW_Vision.md "What it is" paragraph corrected
- [ ] docs/FMW_Vision.md "Bitcoin framing" section updated
- [ ] THMExplainer.tsx description paragraph updated
- [ ] LensTHM.tsx underlying framework section updated
- [ ] docs/CLAUDE.md THM core concept bullet updated
- [ ] No remaining instances of "tracks real economic output"
      in site copy or documentation (search the codebase)
- [ ] All three companion docs updated to reflect current state
- [ ] Owner notified which docs to reload into knowledge base

---

*June 2026*
*freeMarketWatch.world*
*Companion files: CLAUDE.md, docs/FMW_Vision.md, docs/FMW_Architecture.md*
