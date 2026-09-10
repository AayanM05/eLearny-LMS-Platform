package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);

    @Query("select c from Course c where c.active = true and c.published = true and " +
           "(:categoryId is null or c.category.id = :categoryId) and " +
           "(:q is null or lower(c.title) like lower(concat('%', :q, '%')))")
    Page<Course> browse(@Param("categoryId") Long categoryId, @Param("q") String q, Pageable pageable);

    @Query(value = "select * from courses c where lower(c.title) like lower(concat('%', :q, '%'))", nativeQuery = true)
    List<Course> fuzzySearch(@Param("q") String q);
}
