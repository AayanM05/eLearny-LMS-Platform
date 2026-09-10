package com.elearny.dto.request;

import com.elearny.entity.CourseLevel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CourseCreateRequest(
        @NotBlank String title,
        String description,
        String thumbnail,
        CourseLevel level,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        Long categoryId,
        Long prerequisiteCourseId,
        Boolean isCohortBased,
        Integer seatLimit
) {}
