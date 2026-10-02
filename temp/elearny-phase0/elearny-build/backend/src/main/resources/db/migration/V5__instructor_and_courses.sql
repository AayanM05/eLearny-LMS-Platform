-- eLearny Phase 2: Course Authoring (phases.md Phase 2).
-- V2-V4 already applied to real databases -- additive only, per the
-- append-only migration rule established in memory.md.

-- Instructor invite-and-activate support (prd.md §3.26): an approved
-- application creates a User row with no real password yet. These columns
-- hold the single-use, expiring setup token; the OTP itself reuses the
-- existing otp_verifications table with purpose='INSTRUCTOR_SETUP'.
ALTER TABLE users
    ADD COLUMN pending_activation BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN activation_token_hash VARCHAR(255),
    ADD COLUMN activation_token_expires_at TIMESTAMPTZ;

CREATE TABLE instructor_applications (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio               TEXT NOT NULL,
    years_experience  INTEGER NOT NULL,
    expertise_tags    TEXT NOT NULL, -- comma-separated; simple enough for V1, not worth a join table yet
    portfolio_url     VARCHAR(500),
    resume_url        VARCHAR(500),
    status            VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by_user_id UUID REFERENCES users(id),
    reviewed_at       TIMESTAMPTZ,
    rejection_reason  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One applicant can have multiple historical applications (e.g. reapplying
-- after a rejection), so no uniqueness constraint on applicant_user_id --
-- but only one PENDING application at a time is enforced at the service
-- layer, not the database, since a partial unique index keyed on a status
-- value is more fragile across Postgres versions than an application-level
-- check for V1's needs.
CREATE INDEX idx_instructor_applications_applicant ON instructor_applications (applicant_user_id);
CREATE INDEX idx_instructor_applications_status ON instructor_applications (status);

CREATE TABLE courses (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL UNIQUE,
    tagline           VARCHAR(300),
    category          VARCHAR(100),
    difficulty_level  VARCHAR(20)
        CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    price_cents       INTEGER NOT NULL DEFAULT 0,
    thumbnail_url     VARCHAR(500),
    promo_video_url   VARCHAR(500),
    status            VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PUBLISHED')),
    version           INTEGER NOT NULL DEFAULT 1, -- per prd.md §3.1's "versioning" requirement
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_instructor ON courses (instructor_id);
CREATE INDEX idx_courses_status ON courses (status);

CREATE TABLE course_sections (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    position    INTEGER NOT NULL, -- display/curriculum order, not a DB-enforced sequence
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_course_sections_course ON course_sections (course_id);

CREATE TABLE lessons (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id       UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    title            VARCHAR(200) NOT NULL,
    content_type     VARCHAR(20) NOT NULL
        CHECK (content_type IN ('VIDEO', 'ARTICLE', 'RESOURCE')),
    video_url        VARCHAR(500),
    article_content  TEXT,
    resource_url     VARCHAR(500),
    position         INTEGER NOT NULL,
    drip_delay_days  INTEGER NOT NULL DEFAULT 0, -- 0 = available immediately on enrollment
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lessons_section ON lessons (section_id);
