# Production Deployment Plan
## Railway + GitHub + Cloudflare
### Standard for all portfolio apps

*Applies to all apps in the portfolio. Written for handoff to CC and other dev teams.*
*Last updated: May 2026*
*Changelog: v1.2 — three-tier vendor API progression; manual backup required before every schema migration (not just first), auto-migrations, monitoring, backup verification, auth setup, third-party API environment guidance (informed by personal finance app review)*

---

## Overview

| Layer | Service | Purpose |
|-------|---------|---------|
| Source control | GitHub | One repo per app, `staging` and `main` branches |
| Hosting | Railway | App servers + Postgres DB |
| DNS / CDN | Cloudflare | DNS, DDoS protection, SSL, caching |
| Domain registrar | Amazon Route 53 → transfer to Cloudflare | Simplifies DNS management |

**Deploy flow:**
```
Local dev → feature branch → PR → merge to staging → Railway staging deploy (auto)
                                         ↓ test & approve
                               PR → merge to main → Railway production deploy (auto)
```

---

## Part 1 — One-Time Account Setup (Your Actions)

### 1.1 GitHub
You likely have this. Confirm:
- One organization or personal account that owns all app repos
- Each app has its own repo with `main` and `staging` branches

**Create staging branch if it doesn't exist:**
```bash
git checkout -b staging
git push origin staging
```
Set `staging` as a protected branch in GitHub repo Settings → Branches (optional but recommended).

---

### 1.2 Railway Account
1. Go to **railway.app** → Sign up with GitHub (use the same GitHub account that owns your repos)
2. Verify email
3. Upgrade to **Hobby plan ($5/month)** — required for custom domains and persistent Postgres. The free tier is not suitable for production.
4. Note your Railway account URL — it will be `railway.app/dashboard`

---

### 1.3 Cloudflare Account
1. Go to **cloudflare.com** → Sign up (free account is sufficient to start)
2. Verify email
3. You will add each domain to Cloudflare as you deploy each app — details in Part 3

---

### 1.4 Sentry Account (Error Tracking)
1. Go to **sentry.io** → Sign up
2. Create one **Organization** for the portfolio — not a project per account
3. You will add a new Sentry **Project** per app as you deploy each one
4. Each project gives you a DSN — store it as `SENTRY_DSN` in Railway Variables
5. Create separate projects for backend (Node) and frontend (React) per app

---

### 1.5 BetterStack Account (Uptime Monitoring)
1. Go to **betterstack.com** → Sign up
2. You will add a new **Monitor** per app pointing to `/api/health`
3. Set check interval to 1 minute
4. Configure email alerts (add SMS when available)
5. The `/api/health` endpoint must exist and return `{ status: 'ok' }` before the monitor is useful

---

## Part 2 — Railway Project Setup (One-Time Per App)

Do this once for each app. Every app gets its own Railway project.

### 2.1 Create a Railway Project

1. In Railway dashboard → **New Project**
2. Name it to match the repo name exactly (e.g. `freemarketwatch`, `personalfinance`)
3. Railway creates the project with a default `production` environment

### 2.2 Add a Staging Environment

1. Inside the project → click the **Environments** tab
2. **New Environment** → name it `staging`
3. You now have two environments: `production` and `staging`
4. All services you add will exist in both environments with independent configs

### 2.3 Add the Postgres Database Service

*One Railway Postgres instance is shared across all apps. Each app gets its own database inside that instance.*

**First app only — provision the shared instance:**
1. Inside the Railway project → **New Service** → **Database** → **PostgreSQL**
2. Name it `postgres-shared`
3. Railway provisions the instance in both environments automatically
4. Click the Postgres service → **Variables** tab → copy `DATABASE_URL`

**Every app — create per-app databases:**

```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli
railway login
railway connect postgres-shared
```

```sql
-- Run once per app:
CREATE DATABASE appname;
CREATE DATABASE appname_staging;
```

**Update DATABASE_URL per environment in Railway Variables:**
- Production: `postgresql://user:password@host:port/appname`
- Staging: `postgresql://user:password@host:port/appname_staging`

### 2.4 Add the App Service

1. Inside the Railway project → **New Service** → **GitHub Repo**
2. Connect GitHub account if not already connected
3. Select the app repo

### 2.5 Configure the App Service

**Add `railway.json` to the repo root:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/dist/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Add a `Procfile` to repo root as backup:**
```
web: node server/dist/index.js
```

**Ensure `package.json` at repo root builds both frontend and backend:**
```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm install && npm run build",
    "build:server": "cd server && npm install && npm run build",
    "start": "node server/dist/index.js"
  }
}
```

**Serve the React build from Express (add after API routes in `server/index.ts`):**
```typescript
import path from 'path';
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

### 2.6 Auto-Run Migrations on Every Deploy

Migrations must run automatically as part of startup — never as a manual CLI step that can be forgotten. Manual migration steps get skipped; automatic ones never do.

**Update the start command in `railway.json` and `package.json`:**
```json
"startCommand": "node server/dist/db/migrate.js && node server/dist/index.js"
```

```json
{
  "scripts": {
    "start": "node server/dist/db/migrate.js && node server/dist/index.js"
  }
}
```

The migration runner must be **idempotent** — already-applied migrations are tracked and skipped safely. Use a `migrations` table to track which have run.

### 2.7 Set Environment Variables

In Railway dashboard → app service → **Variables** tab.
Set for **both** production and staging environments (with different values where noted):

| Variable | Production value | Staging value | Notes |
|----------|-----------------|---------------|-------|
| `NODE_ENV` | `production` | `staging` | |
| `PORT` | `3001` | `3001` | |
| `DATABASE_URL` | `postgresql://.../appname` | `postgresql://.../appname_staging` | |
| `SENTRY_DSN` | backend DSN from Sentry | same | |
| `VITE_SENTRY_DSN` | frontend DSN from Sentry | same | Used at build time |

Add all app-specific API keys here. See each app's `CLAUDE.md` for its full variable list.

**Do not put secrets in the repo. Railway's Variables tab is the only place they live.**

### 2.8 Configure CORS

Open CORS is acceptable during local development. It must be restricted before any real users or sensitive data exist. Apply this to every app:

```typescript
// server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://appname.com',
        'https://www.appname.com'
      ]
    : [
        'https://staging.appname.com',
        'http://localhost:3000',
        'http://localhost:5173'
      ],
  credentials: true
}));
```

Update the allowed origins list to match the app's actual domains.

### 2.9 Install Sentry in the App

**Backend (`server/index.ts`):**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Add Sentry error handler after all other middleware and routes:
app.use(Sentry.Handlers.errorHandler());
```

**Frontend — install during client build setup:**
```bash
cd client && npm install @sentry/react
```

```typescript
// client/src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### 2.10 Configure Branch-to-Environment Auto-Deploy

1. Click the app service → **Settings** tab → **Source**
2. **Production** environment: set branch to `main`
3. **Staging** environment: set branch to `staging`

Every push to `staging` → auto-deploys to staging URL.
Every push to `main` → auto-deploys to production URL.
Feature branches are never auto-deployed.

### 2.11 Verify Backup Configuration

1. Railway dashboard → Postgres service → **Backups** tab
2. Confirm automated daily backups are enabled
3. Confirm at least 7 days of retention
4. **Before any production deploy that includes schema migrations: take a manual backup first** via the Railway dashboard. This applies to every migration on a production database with real data — not just the first one.

> **Note on staging data:** Once real user data exists in a staging database (e.g. you use staging as your personal test environment for an app with auth), treat that staging database like production. Never run `db:reset` against it. `db:reset` is for local development only. For apps with only reseedable data (like market data), this is less critical but the habit should be consistent.

### 2.12 Seed Initial Data (First Run Only)

For apps that require historical data seeding (e.g. market data):

```bash
railway run --environment production node server/dist/jobs/seedHistoricalData.js
railway run --environment staging node server/dist/jobs/seedHistoricalData.js
```

Monitor progress via Railway's **Logs** tab. This may take several minutes.

---

## Part 3 — Domain Setup

### 3.1 Test on Railway Domain First

Railway provides free subdomains immediately:
```
appname-production.up.railway.app
appname-staging.up.railway.app
```

**Fully validate the app on these URLs before making any DNS changes.** Any existing production site stays live and untouched during this phase.

### 3.2 Move Domain DNS to Cloudflare

This changes nameservers only — the domain stays registered at its current registrar.

1. Cloudflare dashboard → **Add a Site** → enter the domain
2. Cloudflare scans existing DNS records — review and confirm
3. Cloudflare provides two nameserver addresses
4. At the domain registrar (Amazon Route 53 or other) → update nameservers to the Cloudflare values
5. Propagation takes 1-48 hours (usually under 2 hours)
6. Cloudflare emails confirmation when active

**During propagation:** the existing site continues to serve normally.

### 3.3 Add Staging Domain

1. Railway → app service → **staging** environment → **Settings** → **Domains**
2. **Add Custom Domain** → `staging.appname.com`
3. Copy the CNAME target Railway provides
4. Cloudflare DNS → **Add Record**:
   ```
   Type:   CNAME
   Name:   staging
   Target: appname-staging.up.railway.app
   Proxy:  ON (orange cloud)
   ```

### 3.4 Validate Staging

Visit `https://staging.appname.com` and confirm:
- [ ] Site loads over HTTPS
- [ ] API endpoints respond with real data
- [ ] Core features work end to end
- [ ] No console errors
- [ ] Environment variables confirm staging (not production) values are active

### 3.5 Cut Over Production Domain

Once staging is fully validated:

1. Railway → app service → **production** environment → **Settings** → **Domains**
2. Add `appname.com` and `www.appname.com`
3. Copy CNAME targets from Railway
4. Cloudflare DNS — remove old records pointing to previous host, add:
   ```
   Type:   CNAME
   Name:   @
   Target: appname-production.up.railway.app
   Proxy:  ON

   Type:   CNAME
   Name:   www
   Target: appname-production.up.railway.app
   Proxy:  ON
   ```
5. Propagation is near-instant via Cloudflare

### 3.6 Add BetterStack Monitor

Once the production domain is live:
1. BetterStack → **New Monitor**
2. URL: `https://appname.com/api/health`
3. Interval: 1 minute
4. Alert: email (add SMS later)

---

## Part 4 — Third-Party API Environment Safety

Some third-party services (payment processors, financial data APIs, auth providers) have their own environment tiers — typically sandbox/test and production. **Staging must never call a third-party production API.**

Follow this pattern for any service with environment tiers:

| Railway environment | Third-party environment |
|--------------------|------------------------|
| Local dev | Sandbox / Test |
| Staging | Sandbox / Test |
| Production | Production |

**In Railway Variables, set the environment flag explicitly per Railway environment.** Example:

| Variable | Production | Staging |
|----------|-----------|---------|
| `SOME_API_ENV` | `production` | `sandbox` |
| `SOME_API_SECRET` | production secret | sandbox secret |

Always use **different secrets** for sandbox vs production tiers — never share credentials across environments. Double-check these before every deploy that touches third-party integrations.

**Some services have more than two tiers and require explicit vendor approval before production access.** A common three-tier pattern looks like:
```
Sandbox (no approval) → Development/Test (vendor approval, limited access) → Production (separate approval, full access)
```
In these cases, Railway staging maps to the sandbox tier only — never to development or production tiers — until the app is fully validated and vendor approval is obtained. The progression through vendor tiers is a deployment gate; do not skip steps. See each app's deployment override doc for service-specific tier details.

See each app's `CLAUDE.md` and deployment override doc for service-specific setup steps.

---

## Part 5 — Auth Setup (Apps That Require Login)

*Skip this section for apps without user authentication.*

This portfolio uses **Clerk** for authentication. Do this before the first deploy that includes auth.

### 5.1 Create Clerk Application

1. **clerk.com** → create account → **Add Application**
2. Name it to match the app
3. Clerk creates separate **Development** and **Production** instances automatically:
   - Development instance keys → local dev and Railway staging
   - Production instance keys → Railway production only

### 5.2 Configure Allowed Origins

Clerk dashboard → **Settings** → **Domains**:
- Add `https://staging.appname.com`
- Add `https://appname.com`
- `localhost:3000` is allowed by default

Without this, Clerk rejects auth requests from deployed domains.

### 5.3 Set Clerk Variables in Railway

| Variable | Production | Staging |
|----------|-----------|---------|
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` |
| `CLERK_SECRET_KEY` | `sk_live_...` | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | from Clerk dashboard | from Clerk dashboard |

### 5.4 Configure Webhooks

Clerk sends lifecycle events (user created, deleted, etc.) that apps may depend on.

Clerk dashboard → **Webhooks** → **Add Endpoint**:
- Staging: `https://staging.appname.com/api/webhooks/clerk`
- Production: `https://appname.com/api/webhooks/clerk`
- Subscribe to relevant events (at minimum: `user.created`, `user.deleted`)
- Copy webhook secret to `CLERK_WEBHOOK_SECRET` in Railway

See each app's deployment override doc for which events to subscribe to.

---

## Part 6 — Ongoing Deployment Workflow

### Standard workflow for every code change:

```bash
# 1. Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/your-feature-name

# 2. Develop and test locally

# 3. Push and open PR: feature → staging
git push origin feature/your-feature-name
# Open PR on GitHub

# 4. Merge PR → Railway auto-deploys to staging
# Test at https://staging.appname.com

# 5. Open PR: staging → main
# Review diff carefully — this is the final gate

# 6. Merge PR → Railway auto-deploys to production
# Monitor at https://appname.com
```

### Monitoring a deploy:
- Railway dashboard → service → **Deployments** tab
- Failed deploys keep the last successful version running — no downtime on failure

### Rolling back:
- Railway dashboard → **Deployments** tab → previous successful deploy → **Redeploy**
- Takes ~60 seconds

### Checking logs:
```bash
railway logs --environment production
railway logs --environment staging
```

---

## Part 7 — Adding a New App

1. Create GitHub repo with `main` and `staging` branches
2. Create new Railway project (one project per app)
3. Create new databases in shared Postgres:
   ```sql
   CREATE DATABASE appname;
   CREATE DATABASE appname_staging;
   ```
4. Add app service → connect repo → configure branch mapping
5. Set environment variables (see app's `CLAUDE.md` for full list)
6. Configure CORS for the app's domains (Part 2.8)
7. Install Sentry, create new Sentry project, add DSNs to Variables (Part 2.9)
8. Add Cloudflare DNS entries (Part 3)
9. Add BetterStack monitor once production domain is live (Part 3.6)
10. Run migrations and seed data
11. Follow Part 6 for all ongoing deploys

---

## Part 8 — Cloudflare Settings (Apply to All Domains)

| Setting | Value | Why |
|---------|-------|-----|
| SSL/TLS mode | Full (strict) | End-to-end encryption |
| Always Use HTTPS | On | Redirect HTTP → HTTPS |
| Auto Minify | JS + CSS + HTML | Faster load |
| Brotli | On | Better compression |
| Browser Cache TTL | 4 hours | Balance freshness vs performance |
| Security Level | Medium | Good default |
| Bot Fight Mode | On | Free, blocks basic scrapers |

**Add a Cache Rule to bypass cache for API routes:**
```
If URL path starts with /api → Cache: Bypass
```

---

## Part 9 — Cost Estimate

| Service | Cost |
|---------|------|
| Railway Hobby plan | $5/month base + usage (~$5-15/month per app) |
| Railway Postgres (shared) | ~$5/month across all apps |
| Cloudflare | Free for DNS, CDN, SSL |
| GitHub | Free (public) or $4/month (private) |
| Sentry | Free up to 5k errors/month, ~$26/month after |
| BetterStack | Free up to 10 monitors |
| **Total estimate** | **~$15-25/month for first app, ~$10-15/month each additional** |

---

## Part 10 — Pre-Launch Checklist

Apply for every app before promotion. Add app-specific items in each app's deployment override doc.

**Infrastructure**
- [ ] `NODE_ENV=production` confirmed in Railway production Variables
- [ ] All secrets in Railway Variables only — not in source code
- [ ] HTTPS confirmed on production and www domains
- [ ] Staging domain confirmed working
- [ ] BetterStack monitor active on `/api/health`
- [ ] Sentry receiving test errors from production

**Database**
- [ ] Migrations applied and auto-run confirmed on staging deploy
- [ ] Automated backups confirmed running in Railway (7+ days retention)
- [ ] Manual backup taken before every production deploy that includes schema migrations
- [ ] Data seeded if required

**Security**
- [ ] CORS restricted to production domains only
- [ ] No API keys or secrets visible in browser network tab
- [ ] No `console.log` statements leaking sensitive data

**Third-party APIs**
- [ ] All third-party services confirmed using production-tier credentials in Railway production
- [ ] All third-party services confirmed using sandbox/test credentials in Railway staging
- [ ] Webhook endpoints live and receiving events (if applicable)

**Code quality**
- [ ] Browser test: Chrome, Safari, Firefox, mobile
- [ ] Basic error pages for 404 and 500
- [ ] `robots.txt` configured correctly (remove `noindex` if present from development)
- [ ] No console errors on page load

---

## Appendix — Railway CLI Reference

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to a project (run from repo root)
railway link

# View logs
railway logs
railway logs --environment staging

# Run a one-off command in Railway environment
railway run --environment production node server/dist/jobs/seedHistoricalData.js

# Open a shell to Postgres
railway connect postgres-shared

# Check service status
railway status

# Trigger a manual deploy
railway up
```

---

*This document is the standard deployment reference for all apps in this portfolio.*
*For app-specific variables, services, and overrides — see each app's `CLAUDE.md` and deployment override doc.*
*Version 1.2 — May 2026*
