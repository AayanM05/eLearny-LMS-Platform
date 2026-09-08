package com.elearny.course.repository;

import com.elearny.course.entity.Course;
import com.elearny.course.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByInstructorIdOrderByCreatedAtDesc(UUID instructorId);
    List<Course> findByStatusOrderByCreatedAtDesc(CourseStatus status);
    List<Course> findByCategoryAndStatusOrderByCreatedAtDesc(String category, CourseStatus status);
}
