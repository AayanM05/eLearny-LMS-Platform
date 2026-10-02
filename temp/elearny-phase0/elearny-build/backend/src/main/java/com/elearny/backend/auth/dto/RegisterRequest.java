package com.elearny.backend.auth.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Field patterns copied EXACTLY from processflows.md / wireframes.md Master
 * Flow 01 step 1, and fields copied EXACTLY from pages.md §1.1's Register
 * Page spec — do not "improve" these independently, since the frontend
 * (Web + Mobile, per rules.md §13 parity) mirrors these same rules for its
 * live inline validation. If a rule needs to change, change it in the docs
 * first, then here, then both frontends — in that order.
 *
 * Note: pages.md §1.1 also lists a "Confirm Password" field, but that's a
 * frontend-only check (does password == confirmPassword?) — there's no
 * reason to send the same password twice over the wire, so it's not part of
 * this DTO.
 *
 * Phone was removed from registration entirely (2026-09-14, user request) —
 * the User entity still has the column, but it's now collected later via a
 * future "complete your profile" flow rather than at signup. Registration
 * should ask for the minimum needed to create the account.
 */
public record RegisterRequest(

        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Username is required")
        @Pattern(
                regexp = "^[a-zA-Z0-9]{3,20}$",
                message = "Username must be 3-20 characters, letters and numbers only"
        )
        String username,

        @NotBlank(message = "Email is required")
        @Pattern(
                regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message = "Enter a valid email address"
        )
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
                message = "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)"
        )
        String password,

        @AssertTrue(message = "You must accept the Terms of Service and Privacy Policy")
        boolean termsAccepted
) {
}
