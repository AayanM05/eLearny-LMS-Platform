package com.elearny.review;

import com.elearny.common.exception.AccessDeniedCustomException;
import com.elearny.common.exception.BusinessRuleException;
import com.elearny.course.Course;
import com.elearny.course.CourseService;
import com.elearny.enrollment.EnrollmentRepository;
import com.elearny.review.dto.ReviewCreateRequest;
import com.elearny.review.dto.ReviewResponse;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private ReviewService reviewService;

    private User student;
    private Course course;
    private Review review;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .name("Student User")
                .email("student@example.com")
                .role(Role.STUDENT)
                .build();
        student.setId(1L);

        course = Course.builder().title("Fullstack Java").build();
        course.setId(10L);

        review = Review.builder()
                .course(course)
                .student(student)
                .rating(5)
                .comment("Excellent course!")
                .build();
        review.setId(100L);
    }

    @Test
    void create_ShouldCreateReview_WhenStudentIsEnrolledAndHasNotReviewed() {
        ReviewCreateRequest request = new ReviewCreateRequest(5, "Excellent course!");

        when(courseService.findEntity(10L)).thenReturn(course);
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(true);
        when(reviewRepository.existsByCourseAndStudent(course, student)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        ReviewResponse response = reviewService.create(student, 10L, request);

        assertNotNull(response);
        assertEquals(5, response.rating());
        assertEquals("Excellent course!", response.comment());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void create_ShouldThrowException_WhenStudentIsNotEnrolled() {
        ReviewCreateRequest request = new ReviewCreateRequest(5, "Great!");

        when(courseService.findEntity(10L)).thenReturn(course);
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(false);

        assertThrows(AccessDeniedCustomException.class, () -> reviewService.create(student, 10L, request));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void create_ShouldThrowException_WhenStudentHasAlreadyReviewed() {
        ReviewCreateRequest request = new ReviewCreateRequest(5, "Great!");

        when(courseService.findEntity(10L)).thenReturn(course);
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(true);
        when(reviewRepository.existsByCourseAndStudent(course, student)).thenReturn(true);

        assertThrows(BusinessRuleException.class, () -> reviewService.create(student, 10L, request));
        verify(reviewRepository, never()).save(any());
    }
}
