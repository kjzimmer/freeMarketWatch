-- ============================================================
-- 001_initial_schema.sql
-- Full initial schema for FreeMarketWatch.
-- Uses IF NOT EXISTS / OR REPLACE throughout — safe to run on
-- an existing database (local dev bootstrap).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Shared infrastructure ────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Idempotent trigger attachment: no-op if trigger already exists
CREATE OR REPLACE FUNCTION attach_updated_at_trigger(tbl TEXT)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_' || tbl || '_updated_at'
  ) THEN
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl, tbl
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ── Market data tables ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS market_instruments (
  id            SERIAL        PRIMARY KEY,
  ticker        VARCHAR(10)   UNIQUE NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  group_name    VARCHAR(20)   NOT NULL
                  CHECK (group_name IN ('currency', 'riskoff', 'riskon', 'special')),
  data_source   VARCHAR(50),
  frequency     VARCHAR(10)
                  CHECK (frequency IN ('daily', 'monthly', NULL)),
  notes         TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_instruments_group ON market_instruments(group_name);
SELECT attach_updated_at_trigger('market_instruments');

CREATE TABLE IF NOT EXISTS market_price_history (
  id            BIGSERIAL     PRIMARY KEY,
  ticker        VARCHAR(10)   NOT NULL REFERENCES market_instruments(ticker) ON DELETE CASCADE,
  date          DATE          NOT NULL,
  value         NUMERIC(18,8) NOT NULL,
  currency      VARCHAR(5)    NOT NULL DEFAULT 'USD',
  source        VARCHAR(50),
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (ticker, date)
);

CREATE INDEX IF NOT EXISTS idx_market_price_history_ticker_date ON market_price_history(ticker, date);
SELECT attach_updated_at_trigger('market_price_history');

CREATE TABLE IF NOT EXISTS market_cpi_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          UNIQUE NOT NULL,
  cpi_value     NUMERIC(10,4) NOT NULL,
  source        VARCHAR(50)   NOT NULL DEFAULT 'FRED_CPIAUCSL',
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_cpi_history_date ON market_cpi_history(date);
SELECT attach_updated_at_trigger('market_cpi_history');

CREATE TABLE IF NOT EXISTS market_fx_history (
  id              BIGSERIAL     PRIMARY KEY,
  currency_code   VARCHAR(5)    NOT NULL,
  date            DATE          NOT NULL,
  rate_vs_usd     NUMERIC(18,8) NOT NULL,
  source          VARCHAR(50)   NOT NULL DEFAULT 'FRED',
  fetched_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (currency_code, date)
);

CREATE INDEX IF NOT EXISTS idx_market_fx_history_currency_date ON market_fx_history(currency_code, date);
SELECT attach_updated_at_trigger('market_fx_history');

CREATE TABLE IF NOT EXISTS market_pp_series (
  id            BIGSERIAL     PRIMARY KEY,
  ticker        VARCHAR(10)   NOT NULL,
  date          DATE          NOT NULL,
  pp_index      NUMERIC(16,6) NOT NULL,
  nominal_index NUMERIC(16,6),
  window_years  SMALLINT      NOT NULL CHECK (window_years IN (1, 5, 10)),
  window_start  DATE          NOT NULL,
  computed_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (ticker, date, window_years)
);

CREATE INDEX IF NOT EXISTS idx_market_pp_series_ticker_window ON market_pp_series(ticker, window_years);
SELECT attach_updated_at_trigger('market_pp_series');

-- ── Operational log ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fetch_log (
  id            BIGSERIAL     PRIMARY KEY,
  source        VARCHAR(50)   NOT NULL,
  endpoint      TEXT,
  records_added INTEGER,
  success       BOOLEAN       NOT NULL,
  error_msg     TEXT,
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fetch_log_source_fetched ON fetch_log(source, fetched_at DESC);

-- ── Instrument seeds ─────────────────────────────────────────

INSERT INTO market_instruments (ticker, name, group_name, data_source, frequency) VALUES
  ('THM',   'Theoretical Hard Money',          'special',  'calculated',   NULL),
  ('BTC',   'Bitcoin',                          'special',  'CryptoCompare','daily'),
  ('USD',   'US Dollar',                        'currency', 'FRED',         'monthly'),
  ('EUR',   'Euro',                             'currency', 'FRED',         'daily'),
  ('JPY',   'Japanese Yen',                     'currency', 'FRED',         'daily'),
  ('GBP',   'British Pound',                    'currency', 'FRED',         'daily'),
  ('CNY',   'Chinese Yuan',                     'currency', 'FRED',         'daily'),
  ('TLT',   'iShares 20+ Year Treasury Bond',   'riskoff',  'YahooFinance', 'daily'),
  ('GLD',   'SPDR Gold Shares',                 'riskoff',  'YahooFinance', 'daily'),
  ('TIPS',  'iShares TIPS Bond ETF (TIP)',       'riskoff',  'YahooFinance', 'daily'),
  ('AAPL',  'Apple Inc.',                        'riskon',   'YahooFinance', 'daily'),
  ('MSFT',  'Microsoft Corporation',             'riskon',   'YahooFinance', 'daily'),
  ('GOOGL', 'Alphabet Inc.',                     'riskon',   'YahooFinance', 'daily'),
  ('AMZN',  'Amazon.com Inc.',                   'riskon',   'YahooFinance', 'daily'),
  ('NVDA',  'NVIDIA Corporation',                'riskon',   'YahooFinance', 'daily'),
  ('META',  'Meta Platforms Inc.',               'riskon',   'YahooFinance', 'daily'),
  ('TSLA',  'Tesla Inc.',                        'riskon',   'YahooFinance', 'daily'),
  ('MM',    'Money Market (3-month T-bill)',      'riskoff',  'FRED',         'monthly'),
  ('CASH',  'Cash (inflation baseline)',          'riskoff',  'calculated',   NULL)
ON CONFLICT (ticker) DO UPDATE SET
  name        = EXCLUDED.name,
  group_name  = EXCLUDED.group_name,
  data_source = EXCLUDED.data_source,
  frequency   = EXCLUDED.frequency,
  updated_at  = NOW();
