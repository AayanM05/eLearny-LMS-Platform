package com.elearny.dto.request;

import jakarta.validation.constraints.NotNull;

public record DeletionRequestDecision(@NotNull Boolean approve) {}
