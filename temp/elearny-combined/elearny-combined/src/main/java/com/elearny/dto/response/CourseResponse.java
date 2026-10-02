package com.elearny.dto.response;

import com.elearny.entity.Course;
import com.elearny.entity.CourseLevel;

import java.math.BigDecimal;
import java.util.List;

public record CourseResponse(
        Long id, String title, String description, String thumbnail, CourseLevel level,
        BigDecimal price, boolean published, String instructorName, String categoryName,
        Long prerequisiteCourseId, Double averageRating, Long reviewCount,
        List<SectionResponse> sections
) {
    public static CourseResponse summary(Course c) {
        return new CourseResponse(c.getId(), c.getTitle(), c.getDescription(), c.getThumbnail(), c.getLevel(),
                c.getPrice(), c.isPublished(),
                c.getInstructor() != null ? c.getInstructor().getName() : null,
                c.getCategory() != null ? c.getCategory().getName() : null,
                c.getPrerequisiteCourse() != null ? c.getPrerequisiteCourse().getId() : null,
                c.getAverageRating(), c.getReviewCount(), null);
    }
}
