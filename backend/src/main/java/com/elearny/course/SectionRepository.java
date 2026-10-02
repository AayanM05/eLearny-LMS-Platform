package com.elearny.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseOrderByOrderAsc(Course course);
}
