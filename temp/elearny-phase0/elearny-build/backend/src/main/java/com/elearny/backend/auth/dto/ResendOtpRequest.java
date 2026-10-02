package com.elearny.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record ResendOtpRequest(
        @NotBlank(message = "Email is required")
        String email
) {
}
