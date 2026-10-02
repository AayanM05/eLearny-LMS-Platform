package com.elearny.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SectionCreateRequest(@NotBlank String title, @NotNull Integer order) {}
