-- V13__add_username_and_lockout_to_users.sql
-- Add username, failed login attempts, account lockout, and password reset token fields

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP WITH TIME ZONE;

-- Seed existing users with a default username derived from email prefix if null
UPDATE users SET username = SPLIT_PART(email, '@', 1) WHERE username IS NULL;

-- Make username NOT NULL after seeding defaults
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
