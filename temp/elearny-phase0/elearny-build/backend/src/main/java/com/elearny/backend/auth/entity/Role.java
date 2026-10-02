package com.elearny.backend.auth.entity;

/**
 * All 5 roles exist from Phase 1 onward, even though TEACHING_ASSISTANT and
 * SUPER_ADMIN-specific workflows don't ship until V2 (Phase V2-A and the V2
 * governance screens respectively) — see docs/architecture.md and
 * docs/prd.md §0. This avoids a schema migration touching every existing
 * user row when those V2 phases start.
 */
public enum Role {
    STUDENT,
    INSTRUCTOR,
    TEACHING_ASSISTANT,
    ADMIN,
    SUPER_ADMIN
}
