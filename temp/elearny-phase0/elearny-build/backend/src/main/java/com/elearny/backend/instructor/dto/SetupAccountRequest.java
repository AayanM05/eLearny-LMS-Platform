package com.elearny.backend.instructor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Patterns copied from auth/dto/RegisterRequest.java — username/password
 * rules must stay identical across every place an account gets a
 * username/password, per rules.md §13's parity principle (this applies to
 * validation rules matching across flows, not just across platforms).
 */
public record SetupAccountRequest(
        @NotBlank(message = "Setup link is invalid")
        String token,

        @NotBlank(message = "Code is required")
        @Pattern(regexp = "^\\d{6}$", message = "Enter the 6-digit code")
        String otp,

        @NotBlank(message = "Username is required")
        @Pattern(
                regexp = "^[a-zA-Z0-9]{3,20}$",
                message = "Username must be 3-20 characters, letters and numbers only"
        )
        String username,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
                message = "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)"
        )
        String password
) {
}
