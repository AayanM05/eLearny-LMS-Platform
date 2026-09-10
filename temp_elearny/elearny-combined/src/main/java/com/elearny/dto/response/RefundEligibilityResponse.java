package com.elearny.dto.response;

import java.time.LocalDateTime;

/** UI spec S13/AD3: lets the frontend show "you're eligible until [date]" or the specific reason
 *  a refund isn't available, BEFORE the student fills out the request form — not just after
 *  submitting and hitting a rejection. The server-side request() call re-checks the same rule;
 *  this endpoint is a preview, not the enforcement point. */
public record RefundEligibilityResponse(
        boolean eligible, String reasonIfNotEligible, LocalDateTime windowExpiresAt,
        double currentProgressPercent, double maxAllowedProgressPercent
) {}
