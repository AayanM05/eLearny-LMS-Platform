package com.elearny.backend.course.repository;

import com.elearny.backend.course.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {

    List<CourseSection> findAllByCourseIdOrderByPositionAsc(UUID courseId);
}
