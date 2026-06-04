-- ============================================================
-- FreeMarketWatch — Canonical Database Schema
-- Source of truth: never modify the DB without updating this file.
-- ============================================================
--
-- Table namespace conventions (per CLAUDE.md):
--   market_*  — market price data and derived purchasing-power series
--   user_*    — authentication, preferences, access tiers (future)
--   blog_*    — posts, comments, contributors (future)
--   index_*   — proprietary computed indexes (BTC SOV/MOE/UOA, future)
--   fetch_log — operational audit log (cross-cutting, intentionally unprefixed)
--
-- All tables:
--   - created_at TIMESTAMPTZ DEFAULT NOW()
--   - updated_at TIMESTAMPTZ DEFAULT NOW()  [auto-maintained by trigger]
-- ============================================================

-- Enable pgcrypto for future UUID primary keys (user auth)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- SHARED INFRASTRUCTURE
-- ============================================================

-- Trigger function: auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper macro: attach the updated_at trigger to a table
-- Usage: SELECT attach_updated_at_trigger('table_name');
CREATE OR REPLACE FUNCTION attach_updated_at_trigger(tbl TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER trg_%s_updated_at
     BEFORE UPDATE ON %I
     FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
    tbl, tbl
  );
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- MARKET DATA TABLES
-- ============================================================

-- Master instrument registry
-- Covers all market-priced instruments: currencies, equities, ETFs, BTC, and THM.
-- THM (Theoretical Hard Money) is listed here with data_source='calculated' —
-- it has no rows in market_price_history but its pp_index values live in market_pp_series.
-- NOTE: Proprietary computed index series (BTC SOV/MOE/UOA) belong in index_* tables.
CREATE TABLE market_instruments (
  id            SERIAL        PRIMARY KEY,
  ticker        VARCHAR(10)   UNIQUE NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  -- 'currency' → Panel 1, 'riskoff' → Panel 2, 'riskon' → Panel 3
  -- 'special'  → cross-panel (THM appears on every panel; BTC is user-toggleable)
  group_name    VARCHAR(20)   NOT NULL
                  CHECK (group_name IN ('currency', 'riskoff', 'riskon', 'special')),
  data_source   VARCHAR(50),          -- 'FRED', 'CoinGecko', 'YahooFinance', 'calculated'
  frequency     VARCHAR(10)
                  CHECK (frequency IN ('daily', 'monthly', NULL)),
  notes         TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_instruments_group ON market_instruments(group_name);

SELECT attach_updated_at_trigger('market_instruments');


-- Raw price / rate data as received from external APIs
-- value = closing price in USD (equities, BTC) or the raw unit from source
-- This table is append-only by design; pp_series is the computed read layer.
CREATE TABLE market_price_history (
  id            BIGSERIAL     PRIMARY KEY,
  ticker        VARCHAR(10)   NOT NULL
                  REFERENCES market_instruments(ticker) ON DELETE CASCADE,
  date          DATE          NOT NULL,
  value         NUMERIC(20,8) NOT NULL,   -- raw price as received
  currency      VARCHAR(5)    NOT NULL DEFAULT 'USD',
  source        VARCHAR(50),
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (ticker, date)
);

CREATE INDEX idx_market_price_ticker_date ON market_price_history(ticker, date DESC);

SELECT attach_updated_at_trigger('market_price_history');


-- CPI data — the universal deflator applied to all purchasing-power calculations
-- Stored separately because it is referenced by every other series calculation.
-- Source: FRED CPIAUCSL, monthly frequency, history back to 1913-01-01.
-- date = first day of the reference month (FRED convention)
CREATE TABLE market_cpi_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          NOT NULL UNIQUE,
  cpi_value     NUMERIC(10,4) NOT NULL,
  source        VARCHAR(50)   NOT NULL DEFAULT 'FRED_CPIAUCSL',
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_cpi_date ON market_cpi_history(date DESC);

SELECT attach_updated_at_trigger('market_cpi_history');


-- Foreign exchange rates vs USD for currency-panel calculations
-- rate_vs_usd = units of foreign currency per 1 USD
--   EUR: ~0.92  (fewer EUR per dollar → stronger EUR relative to USD)
--   JPY: ~150   (more JPY per dollar → weaker JPY relative to USD)
-- Purchasing-power formula: PP = 100 × (rate_start / rate_t) × (CPI_start / CPI_t)
CREATE TABLE market_fx_history (
  id            SERIAL        PRIMARY KEY,
  currency_code VARCHAR(5)    NOT NULL,   -- 'EUR', 'JPY', 'GBP', 'CNY'
  date          DATE          NOT NULL,
  rate_vs_usd   NUMERIC(16,8) NOT NULL,
  source        VARCHAR(50),              -- 'FRED', 'ECB', etc.
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (currency_code, date)
);

CREATE INDEX idx_market_fx_currency_date ON market_fx_history(currency_code, date DESC);

SELECT attach_updated_at_trigger('market_fx_history');


-- Computed purchasing-power series — the primary read layer for the frontend
-- Rebuilt daily by the compute-pp-series job (Job 5).
-- pp_index is M2/GDP-adjusted and indexed to 100.00 at window_start.
-- window_years: 1, 5, or 10 — matches the frontend timeframe selector.
-- window_start: the exact calendar start date for this computation batch.
--
-- The compute job deletes all existing rows for (ticker, window_years) before
-- reinserting, so no stale window data accumulates.
--
-- ticker is a VARCHAR (no FK) intentionally: THM is in market_instruments but
-- future proprietary index series (btc_sov, btc_moe, btc_uoa) from index_*
-- may also publish to this table before their own index_series table exists.
CREATE TABLE market_pp_series (
  id            BIGSERIAL     PRIMARY KEY,
  ticker        VARCHAR(10)   NOT NULL,
  date          DATE          NOT NULL,
  pp_index      NUMERIC(16,6) NOT NULL,
  nominal_index NUMERIC(16,6),           -- dollar-denominated index (no deflation); NULL until recomputed
  window_years  SMALLINT      NOT NULL CHECK (window_years IN (1, 5, 10)),
  window_start  DATE          NOT NULL,
  computed_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (ticker, date, window_years)
);

CREATE INDEX idx_market_pp_ticker_window_date
  ON market_pp_series(ticker, window_years, date ASC);

CREATE INDEX idx_market_pp_window_date
  ON market_pp_series(window_years, date ASC);

SELECT attach_updated_at_trigger('market_pp_series');


-- M2 Money Supply — for THM methodology charts and calculations
-- Annual averages sufficient for THM; FRED M2SL is monthly (1959–present)
-- Pre-1959 values from Friedman & Schwartz static seed data
-- date = first day of the reference year (e.g., 1913-01-01)
CREATE TABLE market_m2_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          NOT NULL UNIQUE,
  m2_billions   NUMERIC(16,4) NOT NULL,
  source        VARCHAR(100)  NOT NULL,   -- 'FRED_M2SL', 'Friedman_Schwartz'
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_m2_date ON market_m2_history(date ASC);

SELECT attach_updated_at_trigger('market_m2_history');


-- Real GDP — for THM methodology charts and calculations
-- Quarterly GDPC1 from FRED (1947–present); pre-1947 from BEA historical estimates
-- Annual averages used; date = first day of the reference year (e.g., 1913-01-01)
-- Units: billions of chained 2017 USD
CREATE TABLE market_gdp_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          NOT NULL UNIQUE,
  gdp_billions  NUMERIC(16,4) NOT NULL,
  source        VARCHAR(100)  NOT NULL,   -- 'FRED_GDPC1', 'BEA_Historical'
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_gdp_date ON market_gdp_history(date ASC);

SELECT attach_updated_at_trigger('market_gdp_history');


-- ============================================================
-- OPERATIONAL TABLES
-- ============================================================

-- API fetch audit log — every fetch attempt recorded (success or failure)
-- Used by the health-check job (Job 6) to detect stale data sources.
-- Also critical for diagnosing rate-limit issues and API failures.
-- Intentionally unprefixed: it is cross-cutting infrastructure.
CREATE TABLE fetch_log (
  id            BIGSERIAL     PRIMARY KEY,
  source        VARCHAR(50)   NOT NULL,   -- 'FRED', 'CoinGecko', 'YahooFinance', etc.
  endpoint      VARCHAR(500),
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  records_added INT,
  success       BOOLEAN       NOT NULL,
  error_msg     TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fetch_log_source_time  ON fetch_log(source, fetched_at DESC);
CREATE INDEX idx_fetch_log_success_time ON fetch_log(success, fetched_at DESC);

SELECT attach_updated_at_trigger('fetch_log');


-- ============================================================
-- SEED DATA — Instrument Registry
-- ============================================================

INSERT INTO market_instruments (ticker, name, group_name, data_source, frequency, notes) VALUES
  -- Special / cross-panel
  ('THM',   'Theoretical Hard Money',    'special',   'calculated',   NULL,      '2% annual appreciation; not fetched from any API'),

  -- Panel 1: World Currencies
  ('USD',   'US Dollar (CPI-deflated)',  'currency',  'FRED',         'monthly', 'FRED CPIAUCSL; formula: 100 × (CPI_start / CPI_t)'),
  ('EUR',   'Euro',                      'currency',  'FRED',         'daily',   'FRED DEXUSEU; units per USD'),
  ('JPY',   'Japanese Yen',              'currency',  'FRED',         'daily',   'FRED DEXJPUS; units per USD'),
  ('GBP',   'British Pound',             'currency',  'FRED',         'daily',   'FRED DEXUSUK; USD per GBP (inverted — handle in calculation)'),
  ('CNY',   'Chinese Yuan',              'currency',  'FRED',         'daily',   'FRED DEXCHUS; units per USD'),
  ('BTC',   'Bitcoin',                   'currency',  'CoinGecko',    'daily',   'Default panel: currency. User-toggleable to riskon. No data before 2009-01-03.'),

  -- Panel 2: Risk-Off Assets
  ('TLT',   'iShares 20+ Year Treasury ETF', 'riskoff', 'YahooFinance', 'daily', 'Proxy for long-dated US Treasuries'),
  ('GLD',   'SPDR Gold Shares ETF',      'riskoff',   'YahooFinance', 'daily',   'Proxy for spot gold (XAU/USD)'),
  ('TIPS',  'iShares TIPS Bond ETF',     'riskoff',   'YahooFinance', 'daily',   'US Treasury Inflation-Protected Securities'),
  ('MM',    'Money Market (3mo T-bill)', 'riskoff',   'FRED',         'monthly', 'FRED TB3MS; rate series — requires conversion to price index'),
  ('CASH',  'Cash / Savings Rate',       'riskoff',   'FRED',         'monthly', 'Savings rate proxy; FRED series TBD'),

  -- Panel 3: Risk-On (Mag 7 equities)
  ('AAPL',  'Apple Inc.',                'riskon',    'YahooFinance', 'daily',   NULL),
  ('MSFT',  'Microsoft Corporation',     'riskon',    'YahooFinance', 'daily',   NULL),
  ('GOOGL', 'Alphabet Inc.',             'riskon',    'YahooFinance', 'daily',   NULL),
  ('AMZN',  'Amazon.com Inc.',           'riskon',    'YahooFinance', 'daily',   NULL),
  ('NVDA',  'NVIDIA Corporation',        'riskon',    'YahooFinance', 'daily',   'Extreme outperformance — log scale recommended'),
  ('META',  'Meta Platforms Inc.',       'riskon',    'YahooFinance', 'daily',   NULL),
  ('TSLA',  'Tesla Inc.',                'riskon',    'YahooFinance', 'daily',   NULL)

ON CONFLICT (ticker) DO UPDATE SET
  name        = EXCLUDED.name,
  group_name  = EXCLUDED.group_name,
  data_source = EXCLUDED.data_source,
  frequency   = EXCLUDED.frequency,
  notes       = EXCLUDED.notes,
  updated_at  = NOW();


-- ============================================================
-- FUTURE TABLE STUBS
-- (Commented — create when those phases begin. Keep in sync.)
-- ============================================================

-- ── USER AUTH & PREFERENCES ──────────────────────────────────
-- CREATE TABLE user_accounts (
--   id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
--   email           VARCHAR(255)  UNIQUE NOT NULL,
--   password_hash   VARCHAR(255),             -- NULL for OAuth-only accounts
--   access_tier     VARCHAR(20)   NOT NULL DEFAULT 'free',
--                                             -- 'free' | 'paid' | 'institutional'
--   email_verified  BOOLEAN       NOT NULL DEFAULT FALSE,
--   created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
--   updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
-- );
--
-- CREATE TABLE user_sessions (
--   id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id     UUID        NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
--   token_hash  VARCHAR(255) NOT NULL,
--   expires_at  TIMESTAMPTZ NOT NULL,
--   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
--
-- CREATE TABLE user_preferences (
--   user_id              UUID      PRIMARY KEY REFERENCES user_accounts(id) ON DELETE CASCADE,
--   btc_as               VARCHAR(10) NOT NULL DEFAULT 'currency',  -- 'currency' | 'riskon'
--   timeframe_years      SMALLINT  NOT NULL DEFAULT 10,
--   explainer_collapsed  BOOLEAN   NOT NULL DEFAULT FALSE,
--   log_scale_panels     JSONB     NOT NULL DEFAULT '{}',          -- { panelId: boolean }
--   created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );


-- ── BLOG ─────────────────────────────────────────────────────
-- CREATE TABLE blog_posts (
--   id           BIGSERIAL    PRIMARY KEY,
--   author_id    UUID         NOT NULL REFERENCES user_accounts(id),
--   slug         VARCHAR(255) UNIQUE NOT NULL,
--   title        VARCHAR(500) NOT NULL,
--   body_md      TEXT         NOT NULL,
--   status       VARCHAR(20)  NOT NULL DEFAULT 'draft',   -- 'draft'|'published'|'archived'
--   published_at TIMESTAMPTZ,
--   created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--   updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
-- );
--
-- CREATE TABLE blog_comments (
--   id        BIGSERIAL  PRIMARY KEY,
--   post_id   BIGINT     NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
--   author_id UUID       NOT NULL REFERENCES user_accounts(id),
--   body_md   TEXT       NOT NULL,
--   status    VARCHAR(20) NOT NULL DEFAULT 'visible',  -- 'visible'|'hidden'|'deleted'
--   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );


-- ── PROPRIETARY INDEX SERIES (BTC Adoption Indexes) ──────────
-- SOV = Store of Value, MOE = Medium of Exchange, UOA = Unit of Account
-- These are monetized — access gated by user_accounts.access_tier.
--
-- CREATE TABLE index_instruments (
--   id              SERIAL       PRIMARY KEY,
--   slug            VARCHAR(50)  UNIQUE NOT NULL,   -- 'btc_sov', 'btc_moe', 'btc_uoa'
--   name            VARCHAR(100) NOT NULL,
--   description     TEXT,
--   methodology_md  TEXT,
--   access_tier     VARCHAR(20)  NOT NULL DEFAULT 'paid',  -- minimum tier to view
--   created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--   updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
-- );
--
-- CREATE TABLE index_series (
--   id           BIGSERIAL    PRIMARY KEY,
--   index_slug   VARCHAR(50)  NOT NULL REFERENCES index_instruments(slug),
--   date         DATE         NOT NULL,
--   value        NUMERIC(16,6) NOT NULL,
--   computed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--   created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--   updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--   UNIQUE (index_slug, date)
-- );
