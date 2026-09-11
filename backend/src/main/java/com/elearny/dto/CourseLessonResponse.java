package com.elearny.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonResponse {
    private Long id;
    private Long sectionId;
    private String title;
    private String lessonType;
    private String contentUrl;
    private String textContent;
    private int durationSeconds;
    private boolean isFreePreview;
    private int orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
