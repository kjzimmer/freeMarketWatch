-- Migration 002 — Add M2 and GDP history tables for THM methodology charts

CREATE TABLE market_m2_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          NOT NULL UNIQUE,
  m2_billions   NUMERIC(16,4) NOT NULL,
  source        VARCHAR(100)  NOT NULL,
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_m2_date ON market_m2_history(date ASC);

SELECT attach_updated_at_trigger('market_m2_history');


CREATE TABLE market_gdp_history (
  id            SERIAL        PRIMARY KEY,
  date          DATE          NOT NULL UNIQUE,
  gdp_billions  NUMERIC(16,4) NOT NULL,
  source        VARCHAR(100)  NOT NULL,
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_gdp_date ON market_gdp_history(date ASC);

SELECT attach_updated_at_trigger('market_gdp_history');
