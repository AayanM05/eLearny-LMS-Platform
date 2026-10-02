package com.elearny.exam.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public record QuizAttemptRequest(
        @NotEmpty Map<Long, String> answers // questionId -> selectedOption
) {}
