package com.elearny.assignment.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignmentSubmitRequest(@NotBlank String fileUrl) {}
