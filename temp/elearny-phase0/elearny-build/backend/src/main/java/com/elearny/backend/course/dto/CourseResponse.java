package com.elearny.backend.course.dto;

import java.util.UUID;

public record CourseResponse(
        UUID id,
        String title,
        String slug,
        String tagline,
        String category,
        String difficultyLevel,
        int priceCents,
        String thumbnailUrl,
        String promoVideoUrl,
        String status,
        int version
) {
}
