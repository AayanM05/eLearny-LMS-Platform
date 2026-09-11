package com.elearny.repository;

import com.elearny.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {
    List<CourseLesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);
}
