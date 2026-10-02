-- eLearny Phase 1 continued: Email OTP Verification (prd.md §3.26).
-- V2/V3 already applied to real databases, so this is additive per the
-- append-only migration rule established in memory.md.

ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- One row per OTP sent (not one row per user) so a resend doesn't destroy
-- the audit trail of prior attempts, and so the same table can serve both
-- the student email-verification purpose AND the future instructor
-- invite-and-activate purpose (Phase 2) without a second table.
CREATE TABLE otp_verifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash       VARCHAR(255) NOT NULL, -- BCrypt hash, never store the raw code
    purpose         VARCHAR(30) NOT NULL
        CHECK (purpose IN ('EMAIL_VERIFICATION', 'INSTRUCTOR_SETUP')),
    expires_at      TIMESTAMPTZ NOT NULL,
    consumed_at     TIMESTAMPTZ, -- NULL until successfully verified
    attempt_count   INTEGER NOT NULL DEFAULT 0, -- wrong-code attempts against THIS otp row
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_otp_verifications_user_purpose ON otp_verifications (user_id, purpose);
