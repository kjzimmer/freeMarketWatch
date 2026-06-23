# Reusable Admin Modules

Three admin features built for FreeMarketWatch, designed to drop into any similar site:
**JWT Auth**, **Contact/Inquiries Inbox + People CRM**, and **Cloudflare Analytics**.

All three share the same foundation:
- **Backend**: Node.js + Express + TypeScript, raw `pg` (no ORM)
- **Database**: PostgreSQL
- **Auth**: JWT bearer token checked by `requireAdmin` middleware
- **Frontend**: React + TypeScript, CSS-in-JS with CSS custom properties

---

## 0. Auth Foundation

Auth is a prerequisite for all three modules. It must be set up first.

### Data model (SQL)

```sql
CREATE TABLE user_accounts (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255)  UNIQUE NOT NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  is_admin        BOOLEAN       NOT NULL DEFAULT FALSE,
  access_tier     VARCHAR(20)   NOT NULL DEFAULT 'free'
                    CHECK (access_tier IN ('free', 'paid', 'institutional', 'admin')),
  email_verified  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

No separate sessions table — JWT is stateless. `is_admin` is the gate for all admin routes.
`access_tier` is reserved for future public user tiers (free/paid/institutional).

### Environment variables

```env
JWT_SECRET=   # generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Admin credentials are NOT stored in env vars — they live in `user_accounts`. Use the
`create-admin` script (see below) to seed the first admin user.

### Auth middleware (`server/middleware/auth.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  sub: string;
  email: string;
  is_admin: boolean;
}

declare global {
  namespace Express {
    interface Request { admin?: AdminPayload; }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as AdminPayload;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
```

### Auth routes (`server/routes/auth.ts`)

```
POST /api/auth/login   — public; verifies email+password, returns 7-day JWT
GET  /api/auth/me      — requireAdmin; returns token payload (used for session check)
```

Login verifies `is_admin: true` before issuing a token — non-admin accounts cannot log in to the admin panel.

### Seeding the first admin user (`server/scripts/create-admin.ts`)

```typescript
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD'); process.exit(1); }

  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO user_accounts (email, password_hash, is_admin, access_tier, email_verified)
     VALUES ($1, $2, TRUE, 'admin', TRUE)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = $2, is_admin = TRUE, updated_at = NOW()`,
    [email.toLowerCase().trim(), hash]
  );
  console.log(`Admin user ${email} created/updated`);
  await pool.end();
}
run().catch(err => { console.error(err); process.exit(1); });
```

Run once after deploying:
```
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npx tsx scripts/create-admin.ts
```

Safe to re-run — upserts on email.

### Packages

```
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken
```

Note: `bcryptjs` ships its own types — no `@types/bcryptjs` needed.

---

## 1. People CRM

### What it does

Maintains a unified contact record (`admin_people`) for every human who contacts the site.
Records are created automatically when the contact form is submitted (upsert on email),
so no manual data entry is needed. The admin UI shows a list with message counts and a
detail view with editable notes and full message history.

### Data model (SQL)

```sql
CREATE TABLE admin_people (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255)  UNIQUE NOT NULL,
  name        VARCHAR(255)  NOT NULL,
  phone       VARCHAR(50),
  notes       TEXT,
  tags        TEXT[]        NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

Key design decision: **admin_people is the hub; admin_contact_messages is the spoke.**
Contact form submissions upsert admin_people by email before creating the message record.

```typescript
// Pattern used in the contact route:
const { rows: [person] } = await pool.query(
  `INSERT INTO admin_people (email, name)
   VALUES ($1, $2)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
   RETURNING id`,
  [email, name]
);
// then INSERT INTO admin_contact_messages with person_id: person.id
```

### API routes

```
GET    /api/admin/people       [admin] List all people with message_count
GET    /api/admin/people/:id   [admin] Single person with full message history
PATCH  /api/admin/people/:id   [admin] Update name, email, phone, notes, tags
DELETE /api/admin/people/:id   [admin] Delete person (messages SET NULL on person_id)
```

PATCH uses `COALESCE($1, column)` so only fields present in the request body are updated.

### Frontend component (`AdminPeople.tsx`)

Two-panel layout:

- **Left panel**: scrollable list of person cards — name, email, message count, join date.
  Clicking a card selects it.
- **Right panel**: detail view with editable notes textarea (Save button), tag pill display,
  and chronological list of all messages with subject, body, date, and read status.

### Customizing per site

1. Add relation tables as needed (orders, registrations, etc.) and LEFT JOIN them in
   the list query to surface counts.
2. Update the detail panel to show those additional relation types in the history section.
3. `tags` is a free-form `TEXT[]` — use for whatever segmentation makes sense.
4. If you add a newsletter signup form, upsert `admin_people` there too and add a
   `newsletter_subscribers` table linked by `person_id`.

---

## 2. Contact / Inquiries Inbox

### What it does

Stores all inbound contact form submissions. Unread messages are visually highlighted.
Admins can expand messages inline and mark them read. No separate inbox per form type —
extend by adding more message tables and normalizing them in the frontend.

### Data model (SQL)

```sql
CREATE TABLE admin_contact_messages (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id   UUID          REFERENCES admin_people(id) ON DELETE SET NULL,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  subject     VARCHAR(500)  NOT NULL,
  message     TEXT          NOT NULL,
  read        BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

`name`/`email` are duplicated on the message itself (not only on the Person relation)
so messages remain readable if a Person record is later deleted.

### API routes

```
POST  /api/contact           Public — upsert admin_people, create message
GET   /api/contact           [admin] List all messages with person tags, newest first
PATCH /api/contact/:id/read  [admin] Mark a message read
```

No email notification is sent on submission in the current implementation — messages
are stored in the DB and surfaced in the admin inbox. If you need email notification,
add a fire-and-forget fetch to Resend or SendGrid after the INSERT (do not await it —
never let email failure block the user's form submit response).

### Frontend component (`AdminContact.tsx`)

- Fetches from `GET /api/contact` on mount
- Groups into **Unread** (green dot, highlighted border) and **Read** sections
- Each message row: name, email, subject, time-ago timestamp; click to expand full body
- **Mark read** button on expanded unread messages updates state optimistically

### Customizing per site

1. Add more form types (commission requests, event registrations, etc.) as separate tables.
2. In `AdminContact.tsx`, fetch from all relevant endpoints in parallel (`Promise.all`)
   and normalize into a common `Item` shape before rendering.
3. Add a `classify(subject)` function to group messages by category if needed.
4. "Mark read" only applies to contact messages. Other message types with their own
   status workflows belong in dedicated admin sections.

---

## 3. Analytics (Cloudflare)

### What it does

Pulls traffic data from Cloudflare's Zone Analytics GraphQL API and renders it in the
admin dashboard. No third-party analytics service, no cookies, no tracking scripts
required for basic visitor counts.

### Prerequisites

The site's domain must be proxied through Cloudflare (orange cloud in DNS settings).
This is required for Zone Analytics — the core visitor count data. Data is aggregated
by day and is always 1 day behind (today's traffic appears tomorrow).

### Environment variables (server)

```env
CF_ANALYTICS_TOKEN=   # Cloudflare → My Profile → API Tokens
                      # Use "Read analytics and logs" template
                      # Permissions: Zone Analytics only
                      # Zone resources: specific zone (your domain)
CF_ZONE_ID=           # Cloudflare dashboard → click your domain → right sidebar under API
```

Create one token per domain, scoped to that zone only. A leaked token can only read
analytics for one site. Skip client IP filtering — Railway (and most hosts) use dynamic IPs.

### API route (`server/routes/analytics.ts`)

`GET /api/analytics?range=7|14|30` — protected by `requireAdmin`

- Accepts `range` param: 7, 14, or 30 (days). Defaults to 30, clamped to [7, 30].
- Queries Cloudflare GraphQL `httpRequests1dGroups` for daily aggregates
- Aggregates country data across all days, sorted by share (top 8 returned)
- 15-minute in-memory `Map` cache — Cloudflare's daily data doesn't change intra-day
- Returns `{ daily, totals, countries, source: 'cloudflare', range }`

Important: `$zoneTag: String!` in the GraphQL query must use capital-S `String` —
lowercase `string` is silently rejected by Cloudflare.

Uses `axios` (already a server dependency) rather than `fetch` for the Cloudflare call.

### Frontend component (`AdminAnalytics.tsx`)

- Range selector: 7d / 14d / 30d pill buttons, each triggers a fresh API fetch
- **Stat cards**: Unique Visitors, Page Views, Total Requests, Bandwidth
- **Line chart**: Unique Visitors + Page Views over time (Recharts `LineChart`)
- **Country breakdown**: horizontal progress bars, top 8 countries by request share
- **Device type / Top Pages / Top Referrers**: placeholder sections labeled
  "Requires Cloudflare Web Analytics beacon"

When `CF_ANALYTICS_TOKEN` or `CF_ZONE_ID` are not set, the route returns 503 and
the frontend shows a clear configuration message rather than breaking.

### Web Analytics beacon (optional — unlocks device/page/referrer data)

Add once to `index.html`:

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_SITE_TAG"}'></script>
```

Generate the site tag: Cloudflare Dashboard → Web Analytics → Add a site.
The RUM dataset uses a separate GraphQL query (`rumPageloadEventsAdaptiveGroups`).

### Data retention

Cloudflare keeps 30 days. The current implementation queries Cloudflare directly —
no local DB persistence. To build longer-term trend data, add a `DailyAnalytics` table
and write each day's aggregate after fetching (upsert on date). Query local DB for
ranges beyond 30 days.

### Customizing per site

1. Copy `analytics.ts` to the new site's server. Mount at `/api/analytics` in `index.ts`.
2. Add `CF_ANALYTICS_TOKEN` and `CF_ZONE_ID` to the host's environment variables.
3. Copy `AdminAnalytics.tsx` to the new site's frontend. The chart and stat cards are
   completely site-agnostic.
4. Add the Analytics tab to `Admin.tsx`.

---

## Shared Infrastructure

### Auth middleware

See Section 0. `requireAdmin` is imported by all three module route files.

### apiFetch (`client/src/lib/apiFetch.ts`)

The frontend uses a thin `apiFetch` wrapper that attaches the JWT from localStorage
and sets `Content-Type: application/json`. All admin API calls go through this.

```typescript
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data: T }> {
  const token = localStorage.getItem('fmw_admin_token');
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
  }
  return res.json();
}
```

Token key: `fmw_admin_token` — rename per site to avoid localStorage collisions if
multiple FMW-pattern sites are open in the same browser.

### Admin login page (`AdminLogin.tsx`)

Standalone page — no site NavBar/Footer. Posts to `POST /api/auth/login`, stores
the returned JWT in localStorage, navigates to `/admin` on success.

### Admin shell (`Admin.tsx`)

On mount: checks localStorage for token → calls `GET /api/auth/me` to verify it's
still valid → redirects to `/admin/login` if missing or expired.

Tab bar renders Inbox, People, and Analytics tabs. Adding a new module:
1. Add a tab entry to the tabs array
2. Add a conditional render block for the new tab's component

No routing changes needed — the admin panel is a single-page tab switcher, not
a router-based multi-page app.

### Routing in App.tsx

Admin routes are excluded from the public `NavBar`/`Footer` layout by splitting
`App.tsx` into a `PublicLayout` component (with nav/footer + nested `<Routes>`)
and top-level admin routes:

```tsx
export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"       element={<Admin />} />
      <Route path="/*"           element={<PublicLayout />} />
    </Routes>
  );
}
```

Admin routes are excluded from the prerender list — they are auth-gated and
always served as the SPA shell.
