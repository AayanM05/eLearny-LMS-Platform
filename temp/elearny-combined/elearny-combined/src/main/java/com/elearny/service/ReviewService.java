package com.elearny.service;

import com.elearny.dto.request.ReviewCreateRequest;
import com.elearny.dto.response.ReviewResponse;
import com.elearny.entity.Course;
import com.elearny.entity.Review;
import com.elearny.entity.User;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Section 7.10 (Ratings & Reviews): FR25/FR26 — verified-purchase-only, one review per enrollment. */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    @Transactional
    public ReviewResponse create(User student, Long courseId, ReviewCreateRequest req) {
        Course course = courseService.findEntity(courseId);
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new AccessDeniedCustomException("Only enrolled students can review this course."); // FR25
        }
        if (reviewRepository.existsByCourseAndStudent(course, student)) {
            throw new BusinessRuleException("You have already reviewed this course."); // FR26
        }
        Review review = Review.builder().course(course).student(student)
                .rating(req.rating()).comment(req.comment()).build();
        review = reviewRepository.save(review);
        return toResponse(review);
    }

    public List<ReviewResponse> forCourse(Long courseId) {
        Course course = courseService.findEntity(courseId);
        return reviewRepository.findByCourseOrderByCreatedAtDesc(course).stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(r.getId(), r.getStudent().getName(), r.getRating(), r.getComment());
    }
}
