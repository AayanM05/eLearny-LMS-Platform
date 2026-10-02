package com.elearny.backend.course.repository;

import com.elearny.backend.course.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {

    List<Lesson> findAllBySectionIdOrderByPositionAsc(UUID sectionId);
}
