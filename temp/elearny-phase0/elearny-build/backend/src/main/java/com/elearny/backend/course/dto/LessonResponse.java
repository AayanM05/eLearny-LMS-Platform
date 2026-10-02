package com.elearny.backend.course.dto;

import java.util.UUID;

public record LessonResponse(
        UUID id,
        String title,
        String contentType,
        String videoUrl,
        String articleContent,
        String resourceUrl,
        int position,
        int dripDelayDays
) {
}
