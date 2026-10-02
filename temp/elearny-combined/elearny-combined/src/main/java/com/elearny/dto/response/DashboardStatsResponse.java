package com.elearny.dto.response;

import java.math.BigDecimal;

public record DashboardStatsResponse(
        long totalStudents, long totalInstructors, long totalCourses,
        BigDecimal totalRevenue, long pendingInstructorApprovals,
        long pendingRefundRequests, long failedDeliveries
) {}
