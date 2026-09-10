package com.elearny.service;

import com.elearny.entity.Course;
import com.elearny.entity.User;
import com.elearny.entity.Wishlist;
import com.elearny.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Section 7.17 (Wishlist): FR (implied by ER diagram) — simple save-for-later list. */
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CourseService courseService;

    @Transactional
    public void add(User student, Long courseId) {
        Course course = courseService.findEntity(courseId);
        wishlistRepository.findByStudentAndCourse(student, course).orElseGet(() ->
                wishlistRepository.save(Wishlist.builder().student(student).course(course).build()));
    }

    @Transactional
    public void remove(User student, Long courseId) {
        Course course = courseService.findEntity(courseId);
        wishlistRepository.deleteByStudentAndCourse(student, course);
    }

    public List<Wishlist> list(User student) {
        return wishlistRepository.findByStudent(student);
    }
}
