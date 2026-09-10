package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.User;
import com.elearny.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByStudent(User student);
    Optional<Wishlist> findByStudentAndCourse(User student, Course course);
    void deleteByStudentAndCourse(User student, Course course);
}
