package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorApplicationResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String bio;
    private int experienceYears;
    private String expertiseTags;
    private String portfolioUrl;
    private String resumeUrl;
    private String status;
    private String rejectionReason;
    private Long reviewedByUserId;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
}
