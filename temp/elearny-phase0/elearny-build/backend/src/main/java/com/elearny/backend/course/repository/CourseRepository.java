package com.elearny.backend.course.repository;

import com.elearny.backend.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findAllByInstructorIdOrderByCreatedAtDesc(UUID instructorId);

    boolean existsBySlug(String slug);

    Optional<Course> findBySlug(String slug);
}
