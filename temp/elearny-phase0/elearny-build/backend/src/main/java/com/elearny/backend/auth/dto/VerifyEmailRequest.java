package com.elearny.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyEmailRequest(
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Code is required")
        @Pattern(regexp = "^\\d{6}$", message = "Enter the 6-digit code")
        String otp
) {
}
