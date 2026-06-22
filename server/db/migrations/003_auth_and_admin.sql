-- ============================================================
-- Migration 003: User auth, People CRM, Contact messages
-- ============================================================

-- Authenticated users — admins and future public tiers
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

CREATE INDEX idx_user_accounts_email ON user_accounts(email);

SELECT attach_updated_at_trigger('user_accounts');


-- CRM contact records — one per unique email that submits any form
-- Separate from user_accounts: contact submitters are not authenticated users
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

CREATE INDEX idx_admin_people_email ON admin_people(email);

SELECT attach_updated_at_trigger('admin_people');


-- Individual contact form submissions, linked to admin_people
-- name/email duplicated on message so records survive person deletion
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

CREATE INDEX idx_admin_contact_messages_person ON admin_contact_messages(person_id);
CREATE INDEX idx_admin_contact_messages_read   ON admin_contact_messages(read, created_at DESC);

SELECT attach_updated_at_trigger('admin_contact_messages');
