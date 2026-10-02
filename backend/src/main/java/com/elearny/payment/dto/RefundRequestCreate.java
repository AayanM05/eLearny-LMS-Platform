package com.elearny.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record RefundRequestCreate(@NotBlank String reason) {}
