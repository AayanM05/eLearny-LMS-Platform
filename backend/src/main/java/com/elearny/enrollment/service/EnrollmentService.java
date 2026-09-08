package com.elearny.enrollment.service;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.course.entity.Course;
import com.elearny.course.repository.CourseRepository;
import com.elearny.enrollment.dto.EnrollmentResponse;
import com.elearny.enrollment.entity.Enrollment;
import com.elearny.enrollment.repository.EnrollmentRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public EnrollmentResponse enrollUserInCourse(UUID userId, UUID courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> Enrollment.builder()
                        .user(user)
                        .course(course)
                        .progressPercent(BigDecimal.ZERO)
                        .completedLessonsJson("[]")
                        .build());

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getUserEnrollments(UUID userId) {
        return enrollmentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponse updateProgress(UUID userId, UUID courseId, BigDecimal progressPercent, String completedLessonsJson) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for user: " + userId + " course: " + courseId));

        if (progressPercent != null) {
            enrollment.setProgressPercent(progressPercent);
        }
        if (completedLessonsJson != null) {
            enrollment.setCompletedLessonsJson(completedLessonsJson);
        }

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToResponse(saved);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .userId(enrollment.getUser().getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .courseThumbnailUrl(enrollment.getCourse().getThumbnailUrl())
                .progressPercent(enrollment.getProgressPercent())
                .completedLessonsJson(enrollment.getCompletedLessonsJson())
                .createdAt(enrollment.getCreatedAt())
                .updatedAt(enrollment.getUpdatedAt())
                .build();
    }
}
