package com.elearny.backend.instructor.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectApplicationRequest(
        @NotBlank(message = "A rejection reason is required")
        String reason
) {
}
