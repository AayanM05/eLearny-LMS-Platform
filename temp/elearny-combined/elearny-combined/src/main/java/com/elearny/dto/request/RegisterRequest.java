package com.elearny.dto.request;

import com.elearny.entity.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number") String phone,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @NotNull Role role,
        @NotBlank String tosVersion,
        Boolean isUnder18,
        Boolean parentalConsent
) {}
