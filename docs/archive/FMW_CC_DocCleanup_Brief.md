# FreeMarketWatch — CC Briefing
## Documentation Cleanup: As-Is State
### June 2026

---

## Objective

The site has been built through an iterative process involving multiple
briefing documents, draft content files, and phased implementation specs.
Those documents are now out of sync with what is actually implemented.

This task has one goal: **produce a clean set of documentation that
accurately reflects the current state of the site** — what exists, how
it works, and what it is for. No new features. No implementation changes.
Read the codebase and write what is true.

When complete, the owner will archive all existing briefing and draft
documents and work from this new set going forward.

---

## Step 0 — Read everything before writing anything

Read the full codebase. Read all existing project documents. Understand
what was intended vs what was actually implemented. Where they differ,
document what is actually implemented. Note any gaps — features briefed
but not yet built — as explicitly unimplemented rather than omitting
them or documenting them as complete.

Do not make any code changes as part of this task.

---

## Documents to produce

Four documents. Each has a specific purpose and audience.

---

### Document 1: FMW_Vision.md

**Purpose:** What this site is, why it exists, and where it is going.
**Audience:** Non-technical. A new collaborator, a reader, or the owner
reviewing the site's purpose and direction.
**Length:** 2-4 pages.

**Content to cover:**

The site's founding purpose — stated precisely. Read the about page,
the Lens section, and any vision-related content in the existing docs
to synthesize the clearest possible statement of what this site is for.
The owner has articulated a two-point purpose:
1. Purchasing power is the only honest lens for understanding any
   currency or asset. Everything else measures distance with a
   distorted ruler.
2. THM — Theoretical Hard Money — represents what Bitcoin would look
   like as a mature monetary standard, with the adoption phase
   factored out. It is the best available benchmark for what honest
   money looks like.
Capture these two points precisely if they are reflected in the
current site content. If they are not yet fully reflected, note that.

The THM benchmark — what it is, what methodology is currently
implemented (CPI-based or M2/GDP-based — document whichever is
actually live), and what the site says about it.

The Lens section structure — the three components, their current
implementation status (what is live, what is placeholder, what is
not yet built).

What is explicitly deferred or in progress — Component 3 investing
framework, THM toggle, any other features noted as future work.

---

### Document 2: FMW_Architecture.md

**Purpose:** Technical reference for the codebase.
**Audience:** A developer picking up the codebase cold.
**Length:** As long as needed to be complete.

**Content to cover:**

Stack — frontend framework, backend framework, database, hosting,
deployment pipeline. Current versions where relevant.

Repository structure — directory layout, what lives where, key files
a new developer needs to know about.

Database schema — all tables, their columns, their purpose. Note
which tables hold time-series data and at what frequency.

Data sources — every external data source currently in use. For each:
what data it provides, how it is fetched (API, CSV, scheduled job),
how frequently it updates, and what FRED series IDs or other
identifiers are used.

API endpoints — all backend routes. For each: the route, what it
returns, what it is used for in the frontend.

THM calculation — exactly how THM is currently calculated in the
codebase. The formula, where it lives, what inputs it uses.
If the formula changed during implementation (e.g. switched from
CPI to M2/GDP, removed 2% productivity component), document what
is actually implemented now.

Chart data — how chart data flows from DB to frontend. Where
calculations happen (backend vs frontend).

Environment variables — all variables required to run the site,
what each one is for, where they are set. Do not include actual
values — reference structure only.

Deployment — current deployment setup per the Railway/Cloudflare
architecture. Branches, environments, auto-deploy behavior.

---

### Document 3: FMW_Content.md

**Purpose:** Inventory of all site content — every page, its route,
its status, and where its source content lives.
**Audience:** Owner and developer reference.
**Length:** 1-2 pages, structured as a reference table with notes.

**Content to cover:**

A table or structured list of every page/route on the site:
- Route
- Page title
- Content status: Live / Placeholder / Not built
- Source: where the content came from (which briefing doc, written
  by CC, written by owner, etc.)
- Notes: anything relevant (e.g. "uses live data", "static content",
  "epistemic status note displayed")

Then a brief section on content that was briefed but not yet
implemented — so the owner has a clear picture of what remains.

---

### Document 4: CLAUDE.md (update in place)

**Purpose:** CC's primary working reference. Instructions, conventions,
and context for anyone working on the codebase.
**Audience:** CC and any future developer.

**Update — do not replace:**
CLAUDE.md should already exist. Read it, then update it to reflect
current reality. Specifically:

- Update any references to routes, file names, or features that
  changed during implementation
- Update the THM calculation description to match what is actually
  implemented
- Update the data sources section to include M2 and Real GDP if
  they were added
- Add a section noting the documentation set: FMW_Vision.md,
  FMW_Architecture.md, FMW_Content.md as the three companion
  reference documents
- Remove or archive any instructions that no longer apply

Do not add new conventions or instructions — only update to match
current reality.

---

## What to do with existing docs

Do not delete any existing project documents. The owner will archive
them. Your job is only to produce the four documents above.

Place all four new documents in a clearly named location — suggest
`/docs/` in the repo root or equivalent. Note where you put them
in a brief handoff comment.

---

## Definition of done

- [ ] FMW_Vision.md written, reflects current site purpose and state
- [ ] FMW_Architecture.md written, technically accurate to codebase
- [ ] FMW_Content.md written, every route and page inventoried
- [ ] CLAUDE.md updated to reflect current reality
- [ ] No code changes made
- [ ] Any gaps between briefed intent and actual implementation
      noted explicitly in the relevant document
- [ ] Brief handoff note left indicating where new docs are placed
      and any significant gaps found

---

*Documentation cleanup task — June 2026*
*freeMarketWatch.world*
