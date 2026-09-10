package com.elearny.course.dto;

import com.elearny.course.entity.LessonType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    @NotBlank(message = "Lesson title is required")
    private String title;

    private LessonType lessonType;

    private String contentUrl;

    private String articleContent;

    private int durationSeconds;

    private int orderIndex;

    private boolean preview;

    private int dripDelayDays;
}
