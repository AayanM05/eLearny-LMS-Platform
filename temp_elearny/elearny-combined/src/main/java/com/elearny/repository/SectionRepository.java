package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseOrderByOrderAsc(Course course);
}
