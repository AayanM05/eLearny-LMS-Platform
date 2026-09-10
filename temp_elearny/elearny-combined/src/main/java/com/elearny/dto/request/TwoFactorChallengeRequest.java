package com.elearny.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TwoFactorChallengeRequest(@NotBlank String challengeToken, @NotBlank String code) {}
