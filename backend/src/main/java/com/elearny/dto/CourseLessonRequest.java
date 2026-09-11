package com.elearny.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonRequest {
    @NotBlank(message = "Lesson title is required")
    private String title;
    @Builder.Default
    private String lessonType = "VIDEO";
    private String contentUrl;
    private String textContent;
    private int durationSeconds;
    private boolean isFreePreview;
    private int orderIndex;
}
