package com.elearny.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record InstructorUnavailabilityRequest(
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        String reason
) {}
