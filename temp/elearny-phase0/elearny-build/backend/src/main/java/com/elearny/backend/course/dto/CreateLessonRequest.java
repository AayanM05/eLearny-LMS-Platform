package com.elearny.backend.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateLessonRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Content type is required")
        String contentType, // "VIDEO" | "ARTICLE" | "RESOURCE"

        String videoUrl,
        String articleContent,
        String resourceUrl,

        @NotNull(message = "Position is required")
        @Min(value = 0, message = "Position can't be negative")
        Integer position,

        @Min(value = 0, message = "Drip delay can't be negative")
        int dripDelayDays
) {
}
