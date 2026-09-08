package com.elearny.course.dto;

import com.elearny.course.entity.CourseLevel;
import com.elearny.course.entity.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private UUID id;
    private UUID instructorId;
    private String instructorName;
    private String title;
    private String slug;
    private String subtitle;
    private String description;
    private String category;
    private CourseLevel level;
    private String language;
    private BigDecimal price;
    private String thumbnailUrl;
    private CourseStatus status;
    private boolean dripEnabled;
    private List<SectionResponse> sections;
    private Instant createdAt;
    private Instant updatedAt;
}
