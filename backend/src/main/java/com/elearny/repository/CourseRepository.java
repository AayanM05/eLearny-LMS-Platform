package com.elearny.repository;

import com.elearny.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByStatus(String status);
    boolean existsBySlug(String slug);
}
