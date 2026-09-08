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
public class InstructorEarningsDto {
    private BigDecimal totalSales;
    private BigDecimal netEarnings;
    private long totalStudentsEnrolled;
    private long publishedCoursesCount;
}
