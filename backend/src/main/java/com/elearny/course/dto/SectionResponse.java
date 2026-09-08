package com.elearny.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionResponse {
    private UUID id;
    private UUID courseId;
    private String title;
    private int orderIndex;
    private List<LessonResponse> lessons;
    private Instant createdAt;
    private Instant updatedAt;
}
