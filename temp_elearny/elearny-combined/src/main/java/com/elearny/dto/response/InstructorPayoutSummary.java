package com.elearny.dto.response;

import java.math.BigDecimal;

/** UI spec AD6: one row of the "instructor payout summary" report. */
public record InstructorPayoutSummary(String instructorName, BigDecimal totalRevenue, long paymentCount) {}
