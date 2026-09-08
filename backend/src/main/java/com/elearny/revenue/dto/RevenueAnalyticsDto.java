package com.elearny.revenue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueAnalyticsDto {
    private BigDecimal totalPlatformRevenue;
    private BigDecimal totalInstructorPayouts;
    private long totalCompletedOrders;
    private long totalEnrollments;
    private long totalActiveCourses;
    private long totalStudents;
    private long totalInstructors;
}
