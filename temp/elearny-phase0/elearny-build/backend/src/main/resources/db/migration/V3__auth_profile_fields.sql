-- eLearny Phase 1 continued: Register page (pages.md §1.1) needs first/last
-- name and an optional phone number, which V2__auth.sql didn't include.
-- V2 was already applied to real databases (see memory.md's 2026-09-13
-- session log) -- migrations are append-only once applied, so this is a
-- separate file rather than an edit to V2.

ALTER TABLE users
    ADD COLUMN first_name VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN last_name  VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN phone      VARCHAR(20);

-- Drop the defaults now that existing rows (if any) are backfilled with ''
-- -- new rows going forward must supply real names via the API's validation,
-- not silently get an empty string.
ALTER TABLE users ALTER COLUMN first_name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN last_name DROP DEFAULT;
