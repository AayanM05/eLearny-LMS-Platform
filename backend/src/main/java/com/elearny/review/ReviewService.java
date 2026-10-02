package com.elearny.review;

import com.elearny.common.exception.AccessDeniedCustomException;
import com.elearny.common.exception.BusinessRuleException;
import com.elearny.course.Course;
import com.elearny.course.CourseService;
import com.elearny.enrollment.EnrollmentRepository;
import com.elearny.review.dto.ReviewCreateRequest;
import com.elearny.review.dto.ReviewResponse;
import com.elearny.user.User;








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
