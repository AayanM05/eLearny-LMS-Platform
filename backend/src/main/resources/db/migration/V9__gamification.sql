-- V9__gamification.sql
-- Gamification Engine (XP, Streaks, Badges, Leaderboard)

CREATE TABLE user_gamification (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp INTEGER NOT NULL DEFAULT 0,
    streak_count INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE,
    badges VARCHAR(500) NOT NULL DEFAULT 'BEGINNER',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_gamification_xp ON user_gamification(xp DESC);
