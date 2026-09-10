package com.elearny.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefundRequestCreate(@NotBlank String reason) {}
