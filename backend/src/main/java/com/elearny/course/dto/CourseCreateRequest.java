package com.elearny.course.dto;

import com.elearny.course.CourseLevel;








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
