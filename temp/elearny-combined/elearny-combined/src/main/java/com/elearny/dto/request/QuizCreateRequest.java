package com.elearny.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

public record QuizCreateRequest(
        @NotNull @Min(1) @Max(100) Integer passThresholdPercent,
        Boolean allowMultipleAttempts,
        @NotEmpty List<QuizQuestionRequest> questions
) {
    public record QuizQuestionRequest(
            @NotBlank String questionText,
            @NotEmpty List<String> options,
            @NotBlank String correctOption
    ) {}
}
