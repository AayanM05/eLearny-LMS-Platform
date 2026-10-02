package com.elearny.backend.instructor.dto;

import java.time.Instant;
import java.util.UUID;

public record InstructorApplicationResponse(
        UUID id,
        String applicantFirstName,
        String applicantLastName,
        String applicantEmail,
        String bio,
        int yearsExperience,
        String expertiseTags,
        String portfolioUrl,
        String resumeUrl,
        String status,
        Instant createdAt
) {
}
