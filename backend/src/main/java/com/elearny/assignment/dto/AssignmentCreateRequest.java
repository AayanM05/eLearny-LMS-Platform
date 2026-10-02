package com.elearny.assignment.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record AssignmentCreateRequest(
        @NotBlank String instructions,
        String allowedFileTypes,
        LocalDateTime dueDate
) {}
