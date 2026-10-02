package com.elearny.dto.request;

import jakarta.validation.constraints.NotNull;

public record RefundDecisionRequest(@NotNull Boolean approve, String adminNotes) {}
