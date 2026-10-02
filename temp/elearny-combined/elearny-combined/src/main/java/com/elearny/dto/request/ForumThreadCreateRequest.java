package com.elearny.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ForumThreadCreateRequest(@NotBlank String questionText) {}
