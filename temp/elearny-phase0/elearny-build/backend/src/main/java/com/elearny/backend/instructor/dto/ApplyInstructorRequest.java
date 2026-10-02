package com.elearny.backend.instructor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplyInstructorRequest(
        @NotBlank(message = "Bio is required")
        String bio,

        @NotNull(message = "Years of experience is required")
        @Min(value = 0, message = "Years of experience can't be negative")
        Integer yearsExperience,

        @NotBlank(message = "At least one area of expertise is required")
        String expertiseTags,

        String portfolioUrl,

        String resumeUrl
) {
}
