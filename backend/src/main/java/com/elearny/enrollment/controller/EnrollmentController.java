package com.elearny.enrollment.controller;

import com.elearny.enrollment.dto.EnrollmentResponse;
import com.elearny.enrollment.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/my-courses")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal String userId) {
        List<EnrollmentResponse> response = enrollmentService.getUserEnrollments(UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID courseId) {
        EnrollmentResponse response = enrollmentService.enrollUserInCourse(UUID.fromString(userId), courseId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{courseId}/progress")
    public ResponseEntity<EnrollmentResponse> updateProgress(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID courseId,
            @RequestParam(required = false) BigDecimal progressPercent,
            @RequestBody(required = false) String completedLessonsJson) {
        EnrollmentResponse response = enrollmentService.updateProgress(UUID.fromString(userId), courseId, progressPercent, completedLessonsJson);
        return ResponseEntity.ok(response);
    }
}
