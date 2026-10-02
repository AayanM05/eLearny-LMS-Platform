package com.elearny.course.dto;

import com.elearny.course.ContentType;








import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubsectionCreateRequest(
        @NotBlank String title,
        @NotNull ContentType contentType,
        String contentUrl,
        @NotNull Integer order
) {}
