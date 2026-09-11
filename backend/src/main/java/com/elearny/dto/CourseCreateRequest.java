package com.elearny.dto;

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
public class CourseCreateRequest {

    @NotBlank(message = "Course title is required")
    private String title;

    private String subtitle;
    private String description;
    private String thumbnailUrl;
    private String promoVideoUrl;

    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Builder.Default
    private String currency = "USD";

    @Builder.Default
    private String level = "BEGINNER";

    @NotBlank(message = "Category is required")
    private String category;

    private String tags;
}
