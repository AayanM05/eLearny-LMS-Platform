package com.elearny.dto.response;

public record AuthResponse(
        String status,          // "OK" | "2FA_SETUP_REQUIRED" | "2FA_REQUIRED"
        String accessToken,
        String refreshToken,
        String challengeToken,
        UserSummary user
) {
    public static AuthResponse success(String accessToken, String refreshToken, UserSummary user) {
        return new AuthResponse("OK", accessToken, refreshToken, null, user);
    }
}
