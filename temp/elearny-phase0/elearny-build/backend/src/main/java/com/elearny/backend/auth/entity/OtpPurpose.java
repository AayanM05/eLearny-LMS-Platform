package com.elearny.backend.auth.entity;

/**
 * Same table (otp_verifications) serves both purposes — EMAIL_VERIFICATION
 * now (Phase 1), INSTRUCTOR_SETUP later (Phase 2, per prd.md §3.26) — rather
 * than duplicating near-identical tables/services for each.
 */
public enum OtpPurpose {
    EMAIL_VERIFICATION,
    INSTRUCTOR_SETUP
}
