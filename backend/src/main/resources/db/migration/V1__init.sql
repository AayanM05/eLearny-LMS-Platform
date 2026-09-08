-- V1__init.sql
-- Baseline Flyway migration for eLearny LMS

CREATE TABLE IF NOT EXISTS schema_baseline (
    id VARCHAR(36) PRIMARY KEY,
    initialized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_baseline (id) VALUES ('elearny-v1-baseline')
ON CONFLICT (id) DO NOTHING;
