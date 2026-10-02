package com.elearny.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public record CreateSectionRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotNull(message = "Position is required")
        @Min(value = 0, message = "Position can't be negative")
        Integer position
) {
}
