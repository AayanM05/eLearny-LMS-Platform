package com.elearny.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AssignmentSubmitRequest(@NotBlank String fileUrl) {}
