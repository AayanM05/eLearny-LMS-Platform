-- V14: Add drip scheduling to lessons and extend course authoring schema

ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS drip_delay_days INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_lessons_drip_delay ON lessons(drip_delay_days);
