package com.elearny.payment.dto;

import com.elearny.payment.RefundStatus;









import java.math.BigDecimal;

public record RefundRequestResponse(
        Long id, Long paymentId, String reason, RefundStatus status, String adminNotes,
        String studentName, String courseTitle, BigDecimal amount
) {}
