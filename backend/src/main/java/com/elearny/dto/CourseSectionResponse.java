package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionResponse {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private int orderIndex;
    @Builder.Default
    private List<CourseLessonResponse> lessons = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
