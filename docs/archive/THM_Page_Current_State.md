# THM Methodology Page — Current State Summary
## "THM — The Benchmark That Changes Everything"
### Route: /learn/thm
### For handoff to Claude conversation — June 2026

---

## Purpose of this document

This summarizes the current text and structure of the THM methodology page on FreeMarketWatch, as implemented in `client/src/pages/LearnTHM.tsx`. It is intended to be passed into a separate Claude conversation so the full context of this page is available when drafting revisions.

---

## Page header

**Tag:** Methodology

**Title:** THM — The Benchmark That Changes Everything

**Subtitle:** How we calculate the fixed ruler, why it's hard, and why the question matters

**Intro note (italic):** This page is different from the rest of the site. Most pages show you data and explain what it means. This one shows you a genuine open question — one we've wrestled with and haven't fully resolved. We think you deserve to see the work.

---

## Section 1: Why THM is the whole point of this site

Every financial chart you have ever seen measures value in dollars. Stock up 20%. Currency down 8%. Bond yield 4.5%. The dollar is the ruler.

But the ruler is shrinking. Has been since 1913. And nobody marked the graduations.

When you measure everything in a currency that loses value every year, you are not seeing reality. You are seeing a distorted reflection of it. A stock that "went up 40%" may have actually lost purchasing power. A currency that "held steady" may have collapsed against any honest benchmark. An asset praised as a safe haven may have quietly failed at its only job.

This is the founding problem of FreeMarketWatch. **Fiat money is a distorted lens. You cannot understand what anything is truly worth until you have a fixed ruler to measure it against.**

THM — Theoretical Hard Money — is that ruler.

THM answers a specific question: *if money had been honest — if it had held its purchasing power and grown only with real economic productivity — where would that benchmark be today?*

Everything above the THM line on our charts is genuinely gaining purchasing power. Everything below it is losing ground, no matter what the dollar price says. Assets that look like winners in fiat terms often look very different when measured against THM. That difference is the reality that fiat obscures.

No other financial site uses this benchmark. We think that is a problem. Understanding what anything is truly worth requires it.

But THM is only as good as the methodology behind it. Which is where this conversation gets hard.

---

## Section 2: The central problem — what is the right measure of debasement?

To calculate where THM should be today, we need to know how much the dollar has been debased since we started measuring. That sounds straightforward. It isn't.

There are three fundamentally different ways to answer that question. Each is grounded in a different theory of what money is and what debasement means. Each produces a different THM line. And each has a genuine intellectual case behind it.

---

### Approach 1: Inflation indexes *(what we currently use)*

Inflation indexes — CPI, Truflation, the MIT Billion Prices Project — measure debasement by tracking what a basket of goods costs over time. When that basket costs more dollars, the dollar has lost purchasing power.

These are philosophically the same approach. CPI uses a government-defined basket and government survey methodology. Truflation uses real-time private price data and publishes its methodology openly. Both are asking: what does stuff cost now versus then?

**The case for this approach:** It's intuitive. It maps directly to lived experience. When people say "my dollar doesn't go as far," they mean roughly what CPI is measuring. Over 111 years, CPI says the 1913 dollar is worth about 3 cents today.

> **The honest problem:** Inflation indexes are not facts. They are calculations built on thousands of judgment calls: which goods go in the basket (changed dramatically since 1913), hedonic adjustment (when a car gets more features, its measured price is reduced — suppressing inflation), substitution (when beef gets expensive and people buy chicken, the basket shifts — suppressing inflation), and geometric weighting (a 1996 methodology change alone reduced measured CPI by an estimated 0.5–1% per year going forward). Independent measures like Truflation and the MIT Billion Prices Project consistently show inflation running 1–3% higher than official CPI. The bias runs in one direction — downward — and it is set by the same government that benefits financially from understating it.

CPI is not useless. But when you use it to define THM, you are accepting the government's answer to a question the government has a financial interest in understating. A THM built on CPI is probably set too low — it clears a bar that is easier than the honest one.

---

### Approach 2: M2 adjusted for real economic output *(M2/GDP)*

This approach starts from a different theory. Instead of measuring what stuff costs, it measures how much the money supply has grown above what the real economy needed.

The logic: a larger economy needs more money to facilitate more transactions. If real GDP doubles and the money supply stays flat, prices fall by half. So to keep prices stable, the money supply needs to grow in line with GDP — and under this philosophy, that growth is not debasement. Debasement is the money growth *above* real output growth — the excess that dilutes existing holders without backing new production.

**The calculation over 111 years:**
- M2 grew at 6.6% per year
- Real GDP grew at 3.0% per year
- Excess M2 growth — pure debasement by this measure: 3.5% per year
- CPI inflation over the same period: 3.2% per year

Those last two numbers are nearly identical. M2/GDP and CPI converge to almost the same answer over 111 years — 2.3 cents vs 3.1 cents for the 1913 dollar. That convergence is the validation: two completely different methods, measuring from different angles, arriving at the same place.

> M2/GDP is, implicitly, the framework behind the Federal Reserve's own 2% inflation target. The Fed targeted 2% debasement per year and delivered 3.5%. The overshoot is 75%.

The Fed's reasoning: potential real GDP growth is roughly 2–3% per year. The money supply should grow roughly in line with that. Therefore: target 2% inflation. In other words, the Fed is explicitly targeting money growth of approximately real GDP growth plus 2%. M2/GDP measures how much money growth *actually* exceeded real output. They targeted 2% excess. The actual number over 111 years was 3.5%.

> **The honest problem:** M2/GDP embeds a Keynesian assumption — that a growing economy genuinely *needs* proportionally more money. Austrian economics explicitly disputes this. Under the Austrian view, a fixed money supply works perfectly well in a growing economy. Prices simply fall as productivity improves. The GDP adjustment is not neutral — it is accepting a philosophical position in a genuine debate.

---

### Approach 3: Raw M2 *(the purist Austrian view)*

The third approach strips away all assumptions. M2 is the total count of dollars in existence. When that number grows, each existing dollar represents a smaller fraction of the total. That is debasement. All of it, not just the part above GDP growth.

**The case for this approach:** It is the Austrian economics argument in its most precise form. The quantity of money doesn't determine the welfare of an economy — a fixed supply works fine, the price system adjusts. So any growth in the money supply above zero is a dilution of existing holders. M2 is a fact, not a calculation. It requires no basket decisions, no hedonic adjustments, no GDP deflator methodology. If there are 1,200 times as many dollars as in 1913, each dollar is worth 1/1,200th of what it was. That is the math.

From this site's own thesis — that monetary debasement is the root cause of the distortions we chart — raw M2 is the philosophically consistent deflator.

> **The honest problem:** Run the numbers and the result fails the smell test. Raw M2 grew approximately **1,200 times** since 1913. The implied purchasing power of the 1913 dollar is **0.09 cents** — not 3 cents as CPI suggests, but less than a tenth of a cent. People can observably buy things with dollars. That observable reality doesn't match 0.09 cents.

---

## Section 3: What the gap between M2 and M2/GDP is actually telling us

The difference between raw M2 and M2/GDP is almost exactly equal to real GDP growth — roughly 3% per year, compounded over 111 years. That gap is not noise. It is a signal. And it has a precise economic interpretation.

Under a fixed money supply in a growing economy — which is what Austrian economics prescribes — prices would fall as more goods are produced per dollar. The rate of that price decline would equal the rate of real output growth. This is healthy, natural deflation: more abundance per unit of money.

The gap between raw M2 and M2/GDP is *exactly that deflation* — the purchasing power gains that would have accrued to money holders in a hard money world, as economic growth made everything progressively cheaper.

> Raw M2 says the dollar was diluted 1,200-fold. But 56-fold of that dilution was "paid back" through real economic growth that made goods cheaper. The net dilution felt in observable purchasing power was 33-fold — which is what CPI and M2/GDP both show.

The quantity theory of money makes this precise: if the money supply is fixed and real output grows at 3%/yr, prices must fall at 3%/yr. The gap between raw M2 and M2/GDP is exactly that 3%/yr price decline — the productivity deflation that should have happened but was confiscated by money creation instead.

Over 111 years, US real GDP growth of 3%/yr breaks down approximately as:
- Productivity growth (more output per worker): ~1.5–2%/yr
- Labor force growth (more workers): ~1–1.2%/yr
- Capital deepening (more tools per worker): ~0.5%/yr

Under a fixed money supply, all three would produce falling prices, not just the productivity component. The "natural" deflation rate in a healthy growing economy isn't just productivity — it's total real output growth. Historically that has been around 3% per year. The original THM assumption of 2% annual productivity growth was a reasonable estimate. The data suggests the honest number is closer to 3%.

---

## Charts section (live data)

**Chart 1 — The Three THM Lines (1913–present, log scale) · Index: 1913 = 100**
Series: THM_CPI (blue), THM_M2/GDP (green), THM_Raw M2 (orange), Dollar held as cash (flat at 100, white). Log scale. 1971 annotated.

**Chart 2 — Purchasing Power of the 1913 Dollar**
Inverse of Chart 1: 100 / THM × 100. Three lines declining from 100 toward zero. Endpoint values labeled.

**Chart 3 — The Productivity Deflation Gap**
M2 Index vs Real GDP Index vs M2/GDP Ratio (all 1913 = 100). Log scale.

---

## Summary comparison table

| Approach | 1913 dollar today | Theory of debasement | Problem |
|---|---|---|---|
| CPI / Truflation | ~3 cents | Debasement = price rises measured by basket | Government has interest in understating; basket choices are judgment calls |
| M2/GDP | ~2.3 cents | Debasement = money growth above real output | Embeds Keynesian assumption that growing economies need more money |
| Raw M2 (Austrian) | ~0.09 cents | Debasement = any money growth; fixed supply is correct | Fails observable reality check; gap explained by natural productivity deflation |

The THM line moves higher as you move down this table. The more honest the deflator by the site's own thesis, the higher the bar — and the harder any asset has to work to clear it.

---

## Section: Two things that are both true and measuring different things

**Dilution of monetary share** (raw M2): your 1913 dollar now represents 1/1,200th of the total money stock it once did. This is what happened to you as a money *holder*. It is real. It is the Cantillon effect operating at full scale.

**Loss of purchasing power over goods** (CPI/M2/GDP): your 1913 dollar now buys about 1/33rd of the goods it once did. This is what you *feel* at the grocery store. It is also real. It is partly offset by the economic growth that made goods cheaper — the productivity deflation that should have been yours but was largely confiscated by money creation.

Both numbers are true. They are measuring different aspects of the same theft. The first tells you how much was taken. The second tells you how much you actually lost after the economy grew around you.

The difference between them — roughly 36-fold — is the economic growth of the past 111 years. Growth that, under sound money, would have compounded silently in your purchasing power. Instead it was largely captured by those closest to the money creation.

That is the story this site tells. THM is how we tell it with data.

---

## Section: Where we are — and what we're asking

We currently use CPI because it produces a THM line legible alongside real-world asset performance and is most familiar to readers encountering this framework for the first time.

We think this understates true debasement. The philosophical home of this site is closer to the Austrian view. But we haven't resolved the gap between what the Austrian view implies and what observable reality shows — other than the productivity deflation explanation above, which we find compelling but not yet definitive.

We are considering showing all three THM lines simultaneously as a toggle on the charts — so readers can see not just the benchmark, but the range of honest disagreement about where it should be.

**We are also genuinely asking for your input.** This is not a rhetorical invitation. The methodology of THM is an open question, and serious readers who have thought carefully about monetary economics may see things we haven't. If you have a view on which approach is most honest, on what Austrian economics actually implies for THM calculation, or on whether the productivity deflation explanation closes the gap — we want to hear it.

---

## Footer note

- Methodology — Version 2.0 — May 2026
- Current THM: CPI-based, 2% annual productivity growth assumption
- Under review: M2/GDP basis, 3% natural deflation rate
- Source data: Federal Reserve FRED, BLS, BEA, Friedman & Schwartz

---

## New point raised in development conversation (not yet on page)

The Raw M2 approach as described above only accounts for US dollar supply (FRED M2SL). But dollars exist globally — Eurodollars, offshore dollar deposits, dollar-denominated debt issued outside the US banking system. The true global dollar supply is significantly larger than the domestic M2 figure. This is a fourth dimension of the debasement question that the current three approaches do not address: even the "purist" Raw M2 number understates total dollar dilution because it ignores the global dollar system.

This point needs to be incorporated into the page — either as a fourth approach or as a complication added to the Raw M2 section's "honest problem" framing.

---

*Generated June 2026 from LearnTHM.tsx for handoff to separate Claude conversation.*
