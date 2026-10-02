package com.elearny.backend.auth.dto;

public record RefreshResponse(String accessToken, String tokenType, long expiresInSeconds) {
}
