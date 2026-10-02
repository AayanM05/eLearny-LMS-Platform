package com.elearny.backend.course.dto;

import java.util.List;
import java.util.UUID;

public record CourseDetailResponse(
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
        int version,
        List<SectionResponse> sections
) {
}
