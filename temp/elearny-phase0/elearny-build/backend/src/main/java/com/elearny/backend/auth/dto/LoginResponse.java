package com.elearny.backend.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
        RegisterResponse user // reuses the same public-safe user shape as registration
) {
}
