package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.Review;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByCourseAndStudent(Course course, User student);
    List<Review> findByCourseOrderByCreatedAtDesc(Course course);

    @Query("select avg(r.rating) from Review r where r.course = :course")
    Double averageRatingForCourse(@Param("course") Course course);

    @Query("select count(r) from Review r where r.course = :course")
    Long countForCourse(@Param("course") Course course);
}
