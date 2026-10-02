package com.elearny.bundle;

import com.elearny.course.Course;
import com.elearny.user.User;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByStudent(User student);
    Optional<Wishlist> findByStudentAndCourse(User student, Course course);
    void deleteByStudentAndCourse(User student, Course course);
}
