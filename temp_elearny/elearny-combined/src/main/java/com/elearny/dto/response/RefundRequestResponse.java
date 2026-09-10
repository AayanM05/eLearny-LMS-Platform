package com.elearny.dto.response;

import com.elearny.entity.RefundStatus;

import java.math.BigDecimal;

public record RefundRequestResponse(
        Long id, Long paymentId, String reason, RefundStatus status, String adminNotes,
        String studentName, String courseTitle, BigDecimal amount
) {}
