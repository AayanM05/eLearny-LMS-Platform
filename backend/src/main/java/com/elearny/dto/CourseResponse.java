package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private Long instructorId;
    private String instructorName;
    private String title;
    private String slug;
    private String subtitle;
    private String description;
    private String thumbnailUrl;
    private String promoVideoUrl;
    private BigDecimal price;
    private String currency;
    private String level;
    private String category;
    private String tags;
    private String status;
    @Builder.Default
    private List<CourseSectionResponse> sections = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
