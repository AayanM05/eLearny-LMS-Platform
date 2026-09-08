-- V3__instructor_applications.sql
-- Instructor Application & Approval Engine

CREATE TABLE instructor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 0,
    sample_video_url VARCHAR(512),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_instructor_app_user UNIQUE(user_id)
);

CREATE INDEX idx_instructor_app_user ON instructor_applications(user_id);
CREATE INDEX idx_instructor_app_status ON instructor_applications(status);
