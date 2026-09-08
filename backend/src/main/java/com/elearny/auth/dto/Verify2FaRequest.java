package com.elearny.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Verify2FaRequest {

    @NotBlank(message = "Pending 2FA token is required")
    private String pending2faToken;

    @NotBlank(message = "TOTP code is required")
    @Size(min = 6, max = 6, message = "TOTP code must be 6 digits")
    private String totpCode;
}
