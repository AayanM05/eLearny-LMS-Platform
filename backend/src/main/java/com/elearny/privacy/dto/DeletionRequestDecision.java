package com.elearny.privacy.dto;

import jakarta.validation.constraints.NotNull;

public record DeletionRequestDecision(@NotNull Boolean approve) {}
