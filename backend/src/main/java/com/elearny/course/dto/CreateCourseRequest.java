package com.elearny.course.dto;

import com.elearny.course.entity.CourseLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {

    @NotBlank(message = "Course title is required")
    private String title;

    private String subtitle;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private CourseLevel level;

    private String language;

    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    private String thumbnailUrl;
}
