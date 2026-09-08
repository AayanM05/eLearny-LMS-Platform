package com.elearny.instructor.dto;

import com.elearny.instructor.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorApplicationResponse {
    private UUID id;
    private UUID userId;
    private String userFullName;
    private String userEmail;
    private String headline;
    private String bio;
    private int experienceYears;
    private String sampleVideoUrl;
    private ApplicationStatus status;
    private String adminNotes;
    private Instant createdAt;
    private Instant updatedAt;
}
