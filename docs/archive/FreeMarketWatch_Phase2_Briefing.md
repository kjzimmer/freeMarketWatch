# FreeMarketWatch — Phase 2 Build Briefing
## Navigation, Education, Contact, and Visual Redesign
*For Claude Code. Read CLAUDE.md and WEBDESIGN_SKILL.md before starting.*
*May 2026*

---

## Context

The site is live at freemarketwatch.world. The core dashboard (three chart panels,
purchasing power perspective, 1Y/5Y/10Y timeframes, BTC classification toggle) is
working with real data. Phase 2 adds navigation structure, three new pages, and a
visual redesign.

Read the existing codebase before touching anything. Understand the current
component structure, routing (or lack of it), and CSS approach before making changes.

---

## Part 1 — Navigation and Routing

### 1.1 Add React Router

If not already installed:
```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### 1.2 Route Structure

```
/                  → Dashboard (existing charts — no change to functionality)
/about             → About page
/learn             → Education hub (six-act series)
/learn/act/:n      → Individual act (1 through 6)
/contact           → Contact page
```

### 1.3 Navigation Bar

Add a persistent top navigation bar across all pages.

**Design requirements:**
- Fixed to top, full width
- Background: slightly more opaque than the page background — `rgba(6,8,16,0.92)` with
  `backdrop-filter: blur(12px)` — so it feels elevated, not flat
- Left: FreeMarketWatch logo/wordmark (green dot + "FREE MARKET WATCH" text, existing style)
- Right: nav links — Dashboard · Learn · About · Contact
- Active route: THM green underline or highlight
- Mobile: hamburger menu collapsing to a drawer
- Height: 56px desktop, 52px mobile
- The nav must not overlap page content — add 56px top padding to all page wrappers

**Link styling:**
```typescript
// Active link
color: var(--thm-green);
border-bottom: 2px solid var(--thm-green);

// Inactive link
color: var(--text-secondary);  // #94a3b8
// hover: var(--text-primary)
```

### 1.4 Footer

Add a consistent footer to all pages:
- Links: Dashboard · Learn · About · Contact
- Left: © 2026 FreeMarketWatch · Not financial advice
- Right: small text "Data updated daily"
- Background: transparent, top border: `var(--border-subtle)`
- Font: JetBrains Mono, 11px, `var(--text-faint)`

---

## Part 2 — Contact Page (`/contact`)

**Priority: build this first.** The site is live and there is no way for
visitors to reach the owner yet.

### 2.1 Page Purpose

A simple, low-friction way for visitors to send feedback, ask questions,
or express interest. No login required. This is the first version — keep
it simple.

### 2.2 Implementation: Formspree

Use **Formspree** (formspree.io) for form handling. No backend changes
required — forms POST directly to Formspree's endpoint, which emails
the owner.

Setup:
1. Owner creates a free account at formspree.io
2. Creates a new form → gets a form endpoint URL like:
   `https://formspree.io/f/xabcdefg`
3. That URL goes into an environment variable: `VITE_FORMSPREE_ENDPOINT`

```typescript
// Contact form submission
const response = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message })
});
```

Formspree handles spam filtering, email delivery, and stores submissions.
Free tier allows 50 submissions/month — sufficient for early traffic.

### 2.3 Form Fields

- **Name** (text, required)
- **Email** (email, required)
- **Subject** (select dropdown):
  - "General feedback"
  - "Question about the data"
  - "Question about the charts"
  - "I'd like to learn more"
  - "Something looks wrong"
  - "Other"
- **Message** (textarea, required, min 10 chars)
- Submit button: "Send Message"

### 2.4 Page Layout

```
Header: "Get in Touch"
Subhead: "Questions about the data, the methodology, or the ideas behind this
          site — we want to hear from you."

[Form]

Below form — two small info blocks:
  "What this site is about" → 2-3 sentence summary + link to /about
  "Want to go deeper?" → link to /learn
```

### 2.5 Form States

- **Default**: form visible
- **Submitting**: button shows "Sending..." and is disabled
- **Success**: form replaced with confirmation message:
  > "Message received. We'll get back to you at [email]."
- **Error**: inline error message, form stays visible:
  > "Something went wrong. Please try again or email us directly at [owner email]."

---

## Part 3 — About Page (`/about`)

### 3.1 Page Purpose

Explains why the site exists, what the charts show, and how to read them.
Written for a general audience — assume no financial background.

### 3.2 Content Structure

#### Section 1: Why This Site Exists

The founding premise in plain language:

> Most financial charts show you prices in dollars. But dollars lose value
> over time — about 3-4% per year on average. So a stock that "went up 50%"
> might have actually only kept pace with inflation, or even lost purchasing
> power in real terms.
>
> This site shows everything through a different lens: purchasing power.
> Not what something costs in dollars, but whether it actually lets you buy
> more or less over time.
>
> When you look at financial markets this way, the picture changes
> dramatically. Most things that look like they're gaining value are
> actually losing it. A handful of highly productive assets genuinely
> outperform. And hard money — money that can't be inflated away — sits at
> the top of the chart.

#### Section 2: How to Read the Charts

Explain the three key elements every visitor needs to understand:

**The index (start = 100)**
> Every chart starts everything at 100 — regardless of actual price. This
> lets you compare a $2 commodity with a $500 stock on the same scale. What
> matters is how much it changed, not what it costs.

**The THM line (dashed green)**
> THM stands for Theoretical Hard Money — a benchmark we calculated to
> represent what money would look like if it held its purchasing power and
> grew with economic productivity (~2% per year). Everything above this line
> is gaining real purchasing power. Everything below it is losing.

**The timeframes (1Y / 5Y / 10Y)**
> Short timeframes are noisy. The 10-year view is where the real story
> becomes visible — the slow, compounding effect of monetary debasement on
> everything from currencies to savings to the cost of everyday life.

#### Section 3: What You're Seeing in Each Panel

Brief plain-language description of each of the three chart panels:
- **World Currencies** — how major currencies have held (or lost) purchasing power
- **Risk-Off Assets** — instruments traditionally considered "safe" — do they actually protect you?
- **Mag 7 / Risk-On** — the most productive public companies — which ones actually outrun inflation?

#### Section 4: A Note on the Data

Short, honest paragraph:
- Data sources (FRED, CoinGecko, Yahoo Finance)
- CPI as the purchasing power deflator — acknowledged as imperfect
- THM methodology — the 2% figure and why
- Link to methodology drill-downs on the individual charts

#### Section 5: What's Next

Brief forward-looking section:
- Education series: link to /learn
- More instruments being added
- Invite feedback: link to /contact

### 3.3 Design Notes

- Long-form text page — use readable prose width (max 680px centered)
- Section headings in Syne, body text can use a readable system font or
  Syne at lower weight — JetBrains Mono for data references only
- No charts on this page — it's explanatory, not analytical
- Subtle section separators

---

## Part 4 — Education Section (`/learn` and `/learn/act/:n`)

### 4.1 Overview

A six-act educational series taking readers from zero financial knowledge
to understanding why hard money matters and why Bitcoin is the best
implementation of it yet found. Written to be accessible to a general
consumer audience — not academic, not preachy.

This is the full content of the six acts. Implement it faithfully.

---

### 4.2 `/learn` — Education Hub Page

A landing page that introduces the series and shows all six acts as
navigable cards.

**Header:**
```
From Trade to Bitcoin: The Case for Sound Money
A six-part awareness series
```

**Six act cards in a grid (2 columns desktop, 1 column mobile):**

Each card shows:
- Act number (e.g. "Act 1 of 6")
- Title
- One-sentence description
- "Read →" link to `/learn/act/1`
- Visual indicator if act is "complete" (future feature — skip for now)

**Act titles and one-line descriptions:**

| Act | Title | One-liner |
|-----|-------|-----------|
| 1 | Why money exists — and why it matters more than you think | Trade, specialization, and the invention that made civilization possible |
| 2 | What makes good money — and what makes it a weapon | The six properties that separate honest money from a tool of control |
| 3 | What bad money does to the world — the blast radius | From inflation to war — the hidden consequences of money that can be created freely |
| 4 | Hard money changes everything — including how you think | How the money you use shapes your time horizon, your decisions, and your society |
| 5 | Bitcoin — the answer to the question gold could not solve | Why the fatal flaw of every previous hard money system has finally been fixed |
| 6 | What you now understand — and what comes next | Connecting the dots — and where to go from here |

**Below the grid:**
> "Each act takes about 5 minutes to read. They build on each other —
> start at Act 1 if you're new to these ideas."

---

### 4.3 `/learn/act/:n` — Individual Act Page

**Layout:**
```
[Progress bar — shows position in series, e.g. "2 of 6"]
[Act number + Title]
[Full act content]
[Navigation: ← Previous Act | Next Act →]
[Back to series overview]
```

**Progress bar:**
- Simple horizontal bar, 6 segments, current act highlighted in THM green
- Shows "Act N of 6" in JetBrains Mono above it

**Navigation:**
- Previous/Next buttons at bottom of each act
- Act 1: no Previous button
- Act 6: Next button replaced with "Return to Dashboard →" and "Contact Us →"

---

### 4.4 Full Act Content

Implement each act exactly as written below. The content is final — do not
paraphrase, summarize, or restructure it. Render it faithfully.

For formatting:
- Regular paragraphs: `<p>` with comfortable line-height (1.75) and max-width 680px
- Pull quotes (the `| quote |` blocks in the source): styled as blockquotes
  with left border in THM green, italic, slightly larger text
- Data callout tables (the `| stat | stat | stat |` rows): render as
  three-column stat cards — bold number on top, label below, subtle border
- Regular tables: standard styled tables
- "Coming next" teasers at end of each act: styled as a distinct block —
  dark background, THM green border-left, italic text
- "Essential reading" section (Act 6): render as book cards with title,
  author, description, and category tag

---

**ACT 1: Why money exists — and why it matters more than you think**

Think about your morning. Coffee from beans grown in Colombia. A phone assembled
in Asia from parts made on five continents. A commute on roads built by workers
paid in wages, who bought tools made by other workers, who were paid in wages too.

None of that happened by accident. It happened because humans trade — and have
traded for as long as we have existed. Trading is so natural to us we barely
notice it. But it is the single most important thing we do.

Here is why. When people trade, something remarkable happens: they specialize.
Instead of every family growing its own food, making its own clothes, and
building its own shelter — each person does the thing they do best. A farmer
grows more food than his family needs. A weaver makes more cloth than she can
wear. They trade. Both are better off.

That simple idea — specialization through trade — is the engine behind
everything. The longer the chain of people cooperating through trade, the more
complex and capable the things they can build together. A single person cannot
build a smartphone. But a global network of specialists, each trading their
expertise, can.

> Every product you own, every service you use, every medicine that has ever
> saved a life — all of it exists because humans figured out how to trade with
> strangers they would never meet.

Our modern world — with its hospitals, its infrastructure, its food abundance —
is not the result of any single genius or government. It is the accumulated
result of billions of trades, compounding over centuries.

But trade has a problem. If you are a farmer with surplus wheat and you need
shoes, you have to find a shoemaker who happens to need wheat — right now,
today. This is called the double coincidence of wants, and it makes complex
trade nearly impossible. You cannot build a global supply chain on barter.

So humans invented something to solve this problem. Instead of trading goods
directly, one side of every transaction would be a universally accepted
go-between — something everyone would take, even if they personally did not
need it, because they knew someone else would. A medium of exchange.

We call it money.

Money did not come from a government decree. It emerged naturally, from the
bottom up, wherever people traded. Shells, cattle, salt, beads, and eventually
metals — each community converged on whatever worked best as a go-between.
Money is as human as language.

*Coming next: Money made civilization possible. But not all money is equal.
Some forms of money have a hidden property that, over time, quietly destroys
the very trade it was meant to enable. So what makes money good — and what
makes it dangerous?*

---

**ACT 2: What makes good money — and what makes it a weapon**

If you asked most people what money is, they would say something like
"whatever the government issues." But that cannot be right. Governments have
issued all kinds of things as money throughout history — and most of them
eventually failed. Meanwhile, other forms of money emerged without any
government involvement at all, and lasted for centuries.

So what actually makes something good money? It turns out there is a clear
answer — one that history has tested repeatedly. Good money needs to do
several things reliably.

[PROPERTIES TABLE — render as six cards in a 3×2 grid]
- Scarce: Cannot be created freely. If anyone can make more, it loses value.
- Durable: Does not rot, rust, or degrade. It must store value across time.
- Divisible: Can be split into smaller units to enable transactions of any size.
- Fungible: Each unit is identical to every other. One dollar equals any other dollar.
- Portable: Easy to carry and transfer. Wealth must be able to move.
- Verifiable: Anyone can confirm its authenticity without special authority.
- Decentralized: No single entity controls it. Control invites manipulation.

Nobody designed these requirements. They were discovered through trial and
error across thousands of years of human commerce. The monies that survived
were the ones that checked most of these boxes. The ones that failed were
missing one or more.

When you run this test against every money humans have ever used, one commodity
rises above all others: gold. It is extraordinarily scarce — all the gold ever
mined in history would fill roughly three and a half Olympic swimming pools. It
does not corrode. It is divisible, fungible, and recognizable anywhere on earth.
For most of recorded history, gold was the closest thing to perfect money the
world had found.

> Gold did not become the world's reserve money because kings decreed it. It
> became reserve money because it kept winning the competition. Every
> civilization that encountered it independently arrived at the same conclusion.

But gold has one critical weakness. It is heavy. Moving large amounts across
distances is slow, expensive, and dangerous. As trade became global and
economies grew more complex, this became a serious problem.

[TWO-COLUMN TABLE]
Gold's strengths: Scarce, durable, divisible, fungible, verifiable,
decentralized — the best natural money ever found.
Gold's fatal flaw: Heavy and hard to transport. Moving large wealth across
distances requires trust in a third party.

The solution seemed practical at the time: store the gold with trusted
custodians — eventually banks — and carry paper certificates redeemable for
gold instead. The paper was convenient. The gold stayed safe in a vault.
Everyone won.

Except the custodians noticed something. Most people never came to collect
their gold all at once. So the custodians started issuing more certificates
than they had gold to back them. A little at first. Then more. Then governments
got involved and made it official. And once the link between the paper and
the gold was severed entirely — which the United States did in 1971 — the
last constraint on money creation was gone.

Gold's fatal flaw did not just inconvenience us. It was the crack in the door
that let something very different take over.

*Coming next: When the constraint on money creation disappears, something
changes — not just in prices, but in wars, in inequality, in the quality of
the things we build, and in how we think about the future. The consequences
of unlimited money run much deeper than most people realize.*

---

**ACT 3: What bad money does to the world — the blast radius**

Most people think inflation means prices go up. They are not wrong — but they
are only seeing the surface. Inflation is a symptom. The disease is something
much more deliberate: a system that quietly transfers wealth from the people
who earn and save it to the people who control its creation.

Here is the mechanism in plain terms. When new money is created, it enters
the economy through banks, governments, and large financial institutions first.
Those closest to the source spend it before prices have risen. By the time
that new money filters down to ordinary wages and savings, prices have already
adjusted upward. The same purchasing power has been silently redistributed —
from savers to spenders, from the bottom up to the top down.

> Inflation is not a tax that shows up on your bill. It is a tax that shows up
> when you realize your savings bought less than they used to — and nobody
> signed the legislation that took it.

This effect has a name. Economists call it the Cantillon effect, after the
18th-century economist who first described it. It is not a conspiracy theory.
It is a structural feature of how money creation works — and it has been
widening the wealth gap for decades.

[STAT CARDS — three items]
- 97%: Loss in US dollar purchasing power since the Federal Reserve was created in 1913
- 1971: Year the last link between the US dollar and gold was severed — money creation became unlimited
- Top 1%: Now owns more wealth than the entire bottom 90% — a gap that has widened steadily since 1971

But the damage does not stop at your wallet. Unlimited money creation distorts
nearly every corner of society in ways most people never connect back to
their source.

[FOUR IMPACT BLOCKS — render each as a distinct card with title and body]

**War becomes affordable**
Under hard money, wars had to be paid for — through taxes citizens could see
and feel, or through borrowing that had real limits. Governments that could
not afford to fight had to stop fighting. Under fiat money, wars can be
financed by printing. The true cost is socialized across the entire population
through inflation — a hidden tax spread across every citizen's savings and
wages, without a vote or a bill. Hard money did not eliminate war, but it
made it expensive. Fiat money made it cheap.

**Wealth inequality accelerates**
When money loses value over time, holding cash punishes you. So those with
means move their wealth into assets — real estate, stocks, businesses. Asset
prices inflate along with the money supply. Those who own assets get richer
as prices rise. Those who do not own assets — and rely on wages and savings —
fall further behind. This is not a failure of capitalism. It is a predictable
consequence of the money itself.

**Product quality degrades**
When consumers are slowly being squeezed by inflation, producers face pressure
to cut costs without cutting prices visibly. The result is shrinkflation —
smaller packages, cheaper materials, reduced durability. Products are engineered
to be replaced, not to last. In a hard money economy, a craftsman who built
something durable built his reputation for a generation. In an inflationary
economy, planned obsolescence is the rational business strategy.

**Debt becomes a way of life**
If your savings lose value every year, saving is punished. If borrowed money
loses value over time, debt is rewarded — you repay with cheaper dollars than
you borrowed. This inverts the natural human incentive to build before you buy.
Entire generations have been nudged, by the structure of the money itself,
into living on credit rather than accumulating savings. The record levels of
consumer, corporate, and government debt in the world today are not a moral
failure. They are a rational response to bad money.

What is striking about this list is that none of it required a villain. No
single person designed a system to impoverish savers, fund endless wars, and
hollow out the middle class. These are emergent consequences — the natural
result of removing the one constraint that kept money honest: scarcity.

*Coming next: If bad money reshapes behavior, incentives, and society — then
good money should do the opposite. And history shows it does. What does the
world look like when money actually holds its value?*

---

**ACT 4: Hard money changes everything — including how you think**

Here is a question worth sitting with: why do we build things that last?
Cathedrals took generations to complete. The builders who laid the foundation
knew they would never see the finished spire. Medieval craftsmen carved
intricate details into stonework hundreds of feet above ground — details no
human eye would ever clearly see. They built anyway, and they built to last
centuries.

That was not just piety. It was a reflection of how they related to time —
and how their money worked. When money holds its value, the future feels real
and worth investing in. When money loses value, the future feels discounted.
Why build for a hundred years when you cannot reliably plan for ten?

Economists call this time preference — the degree to which people value the
present over the future. Everyone has some preference for the present; that
is human nature. But the structure of money shapes how strong that preference
is, collectively, across an entire society.

> Hard money lowers time preference. It makes the future feel closer, more
> valuable, more worth building toward. Soft money does the opposite — it
> shortens the horizon and nudges everyone toward consuming now rather than
> investing later.

[TWO-COLUMN COMPARISON TABLE]

Soft money world:
- Saving is irrational — your money loses value sitting still.
- Debt is rational — you repay with cheaper money than you borrowed.
- Build to be replaced — planned obsolescence maximizes short-term revenue.
- Governments borrow indefinitely — the cost is socialized through inflation.
- Art and culture optimize for the immediate and disposable.

Hard money world:
- Saving is rewarded — your money holds or gains purchasing power over time.
- Debt is a serious commitment — the money you owe will cost what it costs.
- Build to last — reputation compounds over generations.
- Governments must balance — there is no free money to conjure.
- Art and culture invest in the enduring — things meant to outlast their makers.

Look at the periods of greatest human flourishing — the Renaissance, the
Industrial Revolution, the long 19th century of relative peace and
extraordinary innovation — and you will find hard money at the foundation.
The classical gold standard era from roughly 1870 to 1914 produced more
sustained economic growth, more technological invention, and more broadly
shared prosperity than any comparable period before or since.

That is not a coincidence. When prices are stable, it becomes possible to
plan — really plan — years and decades ahead. A stable unit of account is
the foundation of long-term thinking: businesses can forecast, families can
save toward a goal, and entrepreneurs can take risks that only pay off over
time. Remove that stability and the horizon collapses.

> Sound money does not just change what you can afford. It changes what you
> think is worth doing.

So why did we abandon it? Not because hard money failed. Because it constrained
power. Governments could not fund wars, expand welfare states, or bail out
failing institutions while bound by gold. The discipline that made hard money
good for citizens made it inconvenient for governments. One by one, the
constraints were loosened — until 1971, when the last one was removed entirely.

The question that follows is an obvious one: if gold was the best hard money
humanity ever found — and its only flaw was that it could not be transported
and verified without trusting a third party — what would happen if that flaw
could be fixed?

*Coming next: For the first time in history, that flaw has been fixed. Not
by a government, not by a bank — by mathematics. What is Bitcoin, and why
does it change everything gold could not?*

---

**ACT 5: Bitcoin — the answer to the question gold could not solve**

We have been building toward a specific question. If hard money produces
better outcomes — for individuals, for societies, for the long arc of human
civilization — and if gold was the best hard money ever found, then why can
we not just go back to gold?

The answer is that gold's fatal flaw was never fixed. Moving gold requires
physical trust — vaults, custodians, certificates, and eventually central
banks. Every time gold has been used as the foundation of a monetary system,
that physical limitation created a pressure point. And every time, that
pressure point was eventually exploited. Governments, banks, and institutions
found ways to issue more claims on gold than gold actually existed.

To return to a gold standard would be to repeat the same cycle. The flaw is
structural, not political. No amount of good intentions fixes the fact that
gold is heavy, hard to verify, and impossible to move across the world
instantly without trusting someone.

> What the world needed was something with all of gold's monetary properties —
> but that could be sent anywhere, verified by anyone, and controlled by no
> one. For most of history, that was simply impossible. Then, in 2009, it was not.

Bitcoin was introduced in 2009 by a person or group using the name Satoshi
Nakamoto. The original paper described it as a peer-to-peer electronic cash
system — a way to send value directly between two people anywhere in the
world, without a bank or government in the middle.

But Bitcoin is more than a payment system. It is the first monetary asset in
history that is simultaneously scarce, digital, portable, verifiable, and
controlled by no single authority. It is not issued by any government. No
central bank sets its supply. No institution can inflate it. Its rules are
enforced by mathematics and a globally distributed network of computers —
not by trust in any person or organization.

[COMPARISON TABLE: Bitcoin vs Gold across six properties]

Scarcity — Gold: Finite in nature but unknown total supply. New gold is mined
continuously. Bitcoin: Hard capped at 21 million. The last bitcoin will be
mined around 2140. No one can change this.

Portability — Gold: Heavy and slow. Moving large amounts requires physical
infrastructure and trusted intermediaries. Bitcoin: Sent anywhere in the
world in minutes. A billion dollars moves as easily as a dollar.

Verifiability — Gold: Requires physical testing. Counterfeiting is possible.
Certificates require trust. Bitcoin: Every transaction verified instantly by
the entire network. Counterfeiting is mathematically impossible.

Decentralization — Gold: Storage concentrates in vaults. Custodians become
points of control and failure. Bitcoin: Secured by thousands of independent
nodes worldwide. No single point of control exists.

Durability — Gold: Does not corrode. Physically durable over millennia.
Bitcoin: Exists as information secured by cryptography. Indestructible as
long as the network exists.

Divisibility — Gold: Divisible but requires physical manipulation. Small
transactions are impractical. Bitcoin: Divisible to 8 decimal places. The
smallest unit — one satoshi — enables any transaction size.

Bitcoin does not just match gold on the properties that matter. It solves
the one property gold never could. And in doing so, it removes the pressure
point that every previous hard money system eventually collapsed through.

[FAQ BLOCKS — four questions, render each as an expandable or visually
distinct block]

Is Bitcoin just used by speculators?
Bitcoin's price volatility is real and reflects its early stage of adoption —
just as any emerging asset class is volatile before it matures. But volatility
and utility are separate questions. Gold was also volatile in its early monetary
history. What matters is whether the underlying properties hold. They do, and
have for fifteen years of continuous operation.

Can governments just ban it?
Governments can and do restrict Bitcoin's use within their borders. But Bitcoin
operates on a global, distributed network that no single government controls.
Every country that has attempted an outright ban has found it extremely difficult
to enforce. The network has never been shut down.

What about other cryptocurrencies?
There are thousands of cryptocurrencies. Most are speculative projects with no
fixed supply, central teams that can alter their rules, and no meaningful
monetary properties. Bitcoin is categorically different — it is the only major
digital asset with a provably fixed supply, no controlling authority, and
fifteen years of unbroken operation. The distinction matters.

Is it too late to get involved?
Bitcoin's total adoption relative to the global population remains in the low
single digits. The transition from a fiat monetary system to a sound money
standard — if it happens — is measured in decades, not years. The question
of timing is less important than the question of understanding. Which is why
you are here.

*Coming next: Understanding Bitcoin is the first step. But understanding alone
does not change anything. What does actually adopting a bitcoin standard look
like — and where do you go from here?*

---

**ACT 6: What you now understand — and what comes next**

Most people who encounter Bitcoin for the first time see a price chart. They
wonder whether to buy, whether it is too late, whether it is a bubble or a scam.
They engage with it as a financial instrument — something to trade, speculate
on, or avoid.

That framing misses almost everything that matters.

What you have just worked through is something different. You started with
trade — the most fundamental human behavior. You followed that thread through
specialization, civilization, and the emergence of money. You learned what
makes money good, traced the long dominance of gold, and understood exactly
why gold's one structural flaw was enough to unravel the entire system. You
saw what unlimited money creation does — not just to prices, but to wars,
inequality, incentives, and the texture of daily life. And you arrived at
Bitcoin not through hype, but through logic.

> The most important thing to understand is not Bitcoin. It is the economic
> foundation — what easy money costs, what hard money restores, and why the
> money we use shapes the world we live in. Bitcoin is the solution that
> follows from that understanding.

That understanding changes how you see things. Not just your savings or your
investments — but the news, the political arguments, the sense that something
is wrong that many people feel but struggle to name.

[FOUR INSIGHT BLOCKS — render as cards]

Why housing feels permanently out of reach
Housing is not more expensive because it became more valuable. It is more
expensive because our money became less valuable — and because the wealthy,
understanding this, use real estate as a store of value to protect their
wealth from inflation. Every dollar printed pushes asset prices higher. The
family priced out of their neighborhood is not a victim of a housing shortage.
They are a victim of monetary policy.

Why wages never seem to catch up
Wage earners sit at the furthest end of the chain of new money creation. By
the time new money reaches ordinary salaries, it has already driven up the
cost of goods, housing, and services. Workers experience the effect not as
rising wages but as rising prices. The gap between what they earn and what
life costs widens — not because they work less hard, but because the monetary
system redistributes value away from labor and toward assets, systematically
and invisibly.

Why debt feels inescapable
The modern fiat monetary system cannot function without debt — it requires it
structurally. Money itself is created when banks issue loans. Without new debt,
the money supply contracts. When saving is punished by inflation and borrowing
is subsidized by artificially low interest rates, debt becomes the rational
path. Student loans, mortgages, car payments, credit cards — these are not
personal failures. They are the natural behavior of people navigating a system
that was designed, structurally, to require their debt to keep functioning.

Why everything feels disposable
Consumerism, planned obsolescence, degrading product quality — these are often
blamed on corporate greed. It is a satisfying explanation, but it is wrong.
Corporations do not make disposable products because they are greedy. They
respond to incentives — and the incentives are set by the monetary system.
When inflation continuously erodes purchasing power, consumers buy on price.
When consumers buy on price, producers cut costs. When producers cut costs,
quality falls. The cycle feeds itself. The monetary system explains what greed
alone cannot.

Adopting a bitcoin standard — personally, and eventually as a community — is
not primarily a financial decision. It is a decision about what kind of future
you want to participate in building.

[ESSENTIAL READING — render as book cards]

The Bitcoin Standard — Saifedean Ammous
The definitive economic case for Bitcoin as sound money. Covers monetary
history, the properties of good money, and why Bitcoin is the natural
successor to gold. Start here.
Tag: Bitcoin

The Fiat Standard — Saifedean Ammous
A deep examination of how the fiat monetary system actually works — its
mechanics, its consequences, and why it is structurally unsustainable.
Tag: Monetary

What Has Government Done to Our Money? — Murray Rothbard
A short, readable classic on monetary theory and the history of government
intervention in money.
Tag: Foundation

The Price of Tomorrow — Jeff Booth
Explores the collision between deflationary technology and inflationary
monetary policy.
Tag: Monetary

Broken Money — Lyn Alden
A comprehensive, data-rich examination of the global monetary system.
Tag: Monetary

[CLOSING CTA — two panels]
Left: "Watch the system live" — link to Dashboard
Right: "Find your community" — placeholder for future community feature

---

## Part 5 — Visual Redesign

### 5.1 Current Issues to Fix

The owner has identified these specific issues:
1. Some text is very dark and hard to read — specifically `var(--text-muted)` (#475569)
   used for body text in some places. Minimum contrast for body text should be
   `var(--text-secondary)` (#94a3b8).
2. The overall design is functional but not visually compelling enough for
   a public-facing site.

### 5.2 Text Contrast Fix (Do This First)

Audit every instance of `color: #475569` (var(--text-muted)) in the codebase.
- If it's used for decorative labels or metadata: keep it
- If it's used for any body text or information the user needs to read: bump
  to `#94a3b8` (var(--text-secondary)) minimum
- For main descriptive text under panel headings: use `#94a3b8` minimum

### 5.3 Design Direction Options

Present these three directions to the owner for a decision before implementing.
Build a simple visual mockup or screenshot of each direction applied to the
dashboard header and one chart panel.

**Direction A: Refined Dark (evolution of current)**
Keep the dark space aesthetic but refine it. Improvements:
- More pronounced card depth with subtle inner glow on panel borders
- Panel headers get a thin THM-green left border accent
- Chart backgrounds get a very subtle grid pattern (5% opacity lines)
- Typography hierarchy tightened — panel titles slightly larger, data labels
  slightly bolder
- THM green used more confidently as a brand color in UI elements
- Overall: feels more premium, less prototype

**Direction B: High Contrast Editorial**
Dark background but bolder, more journalistic typography. Think financial
journalism meets data visualization:
- Larger, more dramatic headline typography on the main dashboard header
- Chart panels get white/very light text headers against dark backgrounds
  — like a magazine data spread
- More whitespace between elements
- Accent colors shift slightly: THM green stays, but warmer gold (#d4a843)
  introduced for callouts and data highlights
- Overall: more editorial, less dashboard

**Direction C: Dark but Warmer**
Replace the cold blue-black with a warmer dark palette:
- Background shifts from #060810 (cold blue-black) to #0a0806 (warm near-black)
- Surface cards: #130f0a instead of #0d1117
- Text warm whites: #f0ede8 instead of #e2e8f0
- Bitcoin orange becomes the primary accent instead of THM green
  (THM green stays as the chart line, orange as UI accent)
- Overall: feels warmer, more approachable, less cold/technical

### 5.4 Implementation After Direction Is Chosen

Once the owner selects a direction:
1. Update CSS variables in one place — the design system in WEBDESIGN_SKILL.md
   should be the source of truth
2. Apply to all pages including the new ones being built in this phase
3. Update WEBDESIGN_SKILL.md to reflect the chosen direction

---

## Part 6 — Build Order

1. **Fix text contrast** — quick win, do immediately
2. **Install React Router, add nav bar and footer** — structural foundation
3. **Contact page** — highest priority, site is live with no contact method
4. **About page** — important for first-time visitors
5. **Present design direction options to owner** — get decision before building education pages
6. **Education hub (`/learn`)** — build after design direction confirmed
7. **Individual act pages (`/learn/act/:n`)** — build last, most content

---

## Part 7 — New Environment Variables Needed

Add to Railway Variables (both environments):

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_FORMSPREE_ENDPOINT` | `https://formspree.io/f/xxxxxxx` | Owner must create Formspree account and form first |

---

## Part 8 — Owner Action Required Before Contact Page Can Go Live

1. Go to **formspree.io** → Sign up (free)
2. Create a new form → name it "FreeMarketWatch Contact"
3. Copy the form endpoint URL
4. Add it to Railway Variables as `VITE_FORMSPREE_ENDPOINT` in both environments
5. Confirm the email address Formspree will deliver to

---

*Phase 2 briefing complete.*
*Companion files: CLAUDE.md, WEBDESIGN_SKILL.md, FreeMarketWatch_CC_Spec.md*
*May 2026*

---

## Part 9 — Favicon and App Icon

### 9.1 Design Direction: Option A — Three Lines

The favicon uses three diverging lines to communicate the site's core concept:
- A declining blue line (fiat purchasing power)
- A gently rising dashed green line (THM — the benchmark)
- A steeply rising orange line (outperforming asset)

All on a deep dark background (#060810) with subtle rounded corners.

This communicates what the site does at a glance and is legible at small sizes.

### 9.2 Required Output Sizes

Generate all from a single SVG source:

| File | Size | Use |
|------|------|-----|
| `favicon.ico` | 16×16 + 32×32 (multi-size) | Browser tab |
| `favicon-32x32.png` | 32×32 | Fallback |
| `favicon-16x16.png` | 16×16 | Fallback |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `android-chrome-192x192.png` | 192×192 | Android |
| `android-chrome-512x512.png` | 512×512 | Android splash |

### 9.3 SVG Source

Create `client/public/favicon.svg` as the master source:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Background -->
  <rect width="100" height="100" rx="18" fill="#060810"/>

  <!-- Subtle grid lines -->
  <line x1="12" y1="72" x2="88" y2="72" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <line x1="12" y1="55" x2="88" y2="55" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <line x1="12" y1="38" x2="88" y2="38" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Baseline -->
  <line x1="12" y1="82" x2="88" y2="82" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <!-- Fiat line: declining (blue) -->
  <path d="M15 35 L85 75" stroke="#60a5fa" stroke-width="4"
        fill="none" stroke-linecap="round"/>

  <!-- THM line: gently rising, dashed (green) -->
  <path d="M15 60 L85 48" stroke="#a8ff78" stroke-width="4.5"
        fill="none" stroke-linecap="round" stroke-dasharray="8 4"/>

  <!-- Outperformer: steeply rising (orange) -->
  <path d="M15 75 Q35 65 55 45 L85 22" stroke="#f7931a" stroke-width="4"
        fill="none" stroke-linecap="round"/>
</svg>
```

### 9.4 Generation Script

Use the `sharp` package to generate all sizes from the SVG:

```bash
npm install --save-dev sharp
```

```javascript
// scripts/generate-favicons.js
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('client/public/favicon.svg');

const sizes = [
  { size: 16,  name: 'favicon-16x16.png' },
  { size: 32,  name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

for (const { size, name } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`client/public/${name}`);
  console.log(`Generated ${name}`);
}
```

Run once after any favicon change:
```bash
node scripts/generate-favicons.js
```

For `favicon.ico` (multi-size), use the `ico-endec` or `png-to-ico` package,
or combine the 16px and 32px PNGs:
```bash
npm install --save-dev png-to-ico
```

### 9.5 HTML Head Tags

Add to `client/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#060810" />
```

Also add `client/public/site.webmanifest`:
```json
{
  "name": "FreeMarketWatch",
  "short_name": "FMWatch",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#060810",
  "background_color": "#060810",
  "display": "standalone"
}
```

### 9.6 Verify

After deploying, check:
- [ ] Browser tab shows the icon (not a blank page icon)
- [ ] On iOS: Add to Home Screen shows the correct icon
- [ ] No 404s for favicon files in browser network tab
- [ ] `theme-color` meta tag makes the browser chrome dark on mobile

---

## Part 10 — Deferred Features (Do Not Build Now)

These are captured here so they are not forgotten. Build after MVP is
stable and in use by the initial network.

### Machine-Readable Site Access (for AI tools, crawlers, future promotion)

React SPAs return an empty HTML shell to crawlers — AI tools including
Claude cannot read the site content via URL fetch. Three lightweight
additions will fix this when the time comes:

1. **`/site-summary.txt`** — static plain text file summarizing the site,
   its methodology, and what the data shows. Served from `client/public/`.
   AI tools can fetch this directly. 30-minute task.

2. **Open Graph + meta tags** — `og:title`, `og:description`, `og:image`,
   `twitter:card` on each route. Improves social sharing and SEO.
   Should be added per-route using `react-helmet` or equivalent.

3. **`/api/summary` endpoint** — lightweight API returning current chart
   data state as JSON. Useful for AI tools, embeds, and third-party
   integrations.

These three are a natural bundle — implement together when promotion begins.

