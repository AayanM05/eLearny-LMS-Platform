package com.elearny.backend.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * Used for both create and update — full-replace semantics (every field is
 * sent every time), the simplest correct option for V1 rather than a
 * separate PATCH-style partial-update DTO.
 */
public record SaveCourseRequest(
        @NotBlank(message = "Title is required")
        String title,

        String tagline,

        String category,

        String difficultyLevel, // "BEGINNER" | "INTERMEDIATE" | "ADVANCED" — validated against the enum in the service, not here, so an invalid value gets a clear message rather than a raw deserialization error

        @Min(value = 0, message = "Price can't be negative")
        int priceCents,

        String thumbnailUrl,

        String promoVideoUrl
) {
}
