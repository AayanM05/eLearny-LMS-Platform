package com.elearny.payment.dto;

import jakarta.validation.constraints.NotNull;

public record RefundDecisionRequest(@NotNull Boolean approve, String adminNotes) {}
