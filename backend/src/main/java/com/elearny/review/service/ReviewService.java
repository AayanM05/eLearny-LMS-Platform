package com.elearny.review.service;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.course.entity.Course;
import com.elearny.course.repository.CourseRepository;
import com.elearny.review.entity.Review;
import com.elearny.review.repository.ReviewRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public Review addReview(UUID userId, UUID courseId, int rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        Review review = Review.builder()
                .user(user)
                .course(course)
                .rating(rating)
                .comment(comment)
                .build();

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<Review> getCourseReviews(UUID courseId) {
        return reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }
}
