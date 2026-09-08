package com.elearny.enrollment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private UUID id;
    private UUID userId;
    private UUID courseId;
    private String courseTitle;
    private String courseThumbnailUrl;
    private BigDecimal progressPercent;
    private String completedLessonsJson;
    private Instant createdAt;
    private Instant updatedAt;
}
