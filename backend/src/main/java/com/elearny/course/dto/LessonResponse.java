package com.elearny.course.dto;

import com.elearny.course.entity.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    private UUID id;
    private UUID sectionId;
    private String title;
    private LessonType lessonType;
    private String contentUrl;
    private String articleContent;
    private int durationSeconds;
    private int orderIndex;
    private boolean preview;
    private int dripDelayDays;
    private Instant createdAt;
    private Instant updatedAt;
}
