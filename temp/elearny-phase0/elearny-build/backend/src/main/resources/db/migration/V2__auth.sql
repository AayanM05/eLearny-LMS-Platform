-- eLearny Phase 1: Auth, Roles & Identity Security.
-- 5-role RBAC model is established here from day one (rather than adding
-- TEACHING_ASSISTANT / SUPER_ADMIN later) so V2's TA and Super Admin
-- workflows (Phase V2-A / governance features) don't need a schema migration
-- that touches every existing user row — see docs/architecture.md.

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(20) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(30) NOT NULL
        CHECK (role IN ('STUDENT', 'INSTRUCTOR', 'TEACHING_ASSISTANT', 'ADMIN', 'SUPER_ADMIN')),
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    account_locked  BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret  VARCHAR(255), -- only set once 2FA setup is confirmed; never returned in any API response
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive username/email lookups (login, registration uniqueness
-- checks) without needing LOWER() on every query.
CREATE UNIQUE INDEX idx_users_username_lower ON users (LOWER(username));
CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));

-- GDPR terms/privacy consent, recorded per prd.md §3.25 (basic consent
-- recording is V1; advanced privacy-preference management is V2).
CREATE TABLE consent_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type    VARCHAR(50) NOT NULL, -- e.g. 'TERMS_OF_SERVICE', 'PRIVACY_POLICY'
    accepted        BOOLEAN NOT NULL,
    accepted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address      VARCHAR(45), -- IPv4 or IPv6
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_records_user_id ON consent_records (user_id);
