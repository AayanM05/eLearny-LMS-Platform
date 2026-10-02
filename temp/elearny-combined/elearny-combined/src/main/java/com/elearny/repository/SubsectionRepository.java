package com.elearny.repository;

import com.elearny.entity.Section;
import com.elearny.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubsectionRepository extends JpaRepository<Subsection, Long> {
    List<Subsection> findBySectionOrderByOrderAsc(Section section);

    @Query("select count(s) from Subsection s where s.section.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
}
