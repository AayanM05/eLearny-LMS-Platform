package com.elearny.enrollment;

import com.elearny.admin.AuditService;
import com.elearny.common.exception.BusinessRuleException;
import com.elearny.course.Course;
import com.elearny.course.CourseRepository;
import com.elearny.user.Role;
import com.elearny.user.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private User student;
    private Course course;
    private Enrollment enrollment;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .email("student@example.com")
                .name("John Student")
                .role(Role.STUDENT)
                .build();
        student.setId(1L);

        course = Course.builder()
                .title("Java Fundamentals")
                .published(true)
                .price(BigDecimal.ZERO)
                .isCohortBased(false)
                .build();
        course.setId(100L);

        enrollment = Enrollment.builder()
                .user(student)
                .course(course)
                .enrolledDate(LocalDate.now())
                .revoked(false)
                .build();
        enrollment.setId(50L);
    }

    @Test
    void enrollFree_ShouldCreateEnrollment_WhenUserNotEnrolledAndCourseIsFree() {
        when(enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)).thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);

        Enrollment result = enrollmentService.enrollFree(student, course);

        assertNotNull(result);
        assertEquals(student, result.getUser());
        assertEquals(course, result.getCourse());
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
    }

    @Test
    void enrollFree_ShouldThrowException_WhenCourseHasPrice() {
        course.setPrice(BigDecimal.valueOf(49.99));

        assertThrows(BusinessRuleException.class, () -> enrollmentService.enrollFree(student, course));
        verify(enrollmentRepository, never()).save(any());
    }
}
