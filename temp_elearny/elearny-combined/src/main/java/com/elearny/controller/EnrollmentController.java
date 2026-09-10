package com.elearny.controller;

import com.elearny.entity.Course;
import com.elearny.entity.Enrollment;
import com.elearny.service.CourseService;
import com.elearny.service.EnrollmentService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Tag(name = "Enrollment", description = "FR19-FR21")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final CourseService courseService;

    @PostMapping("/free/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollFree(@PathVariable Long courseId) {
        Course course = courseService.findEntity(courseId);
        return ResponseEntity.ok(enrollmentService.enrollFree(SecurityUtils.currentUser(), course));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> myEnrollments() {
        return ResponseEntity.ok(enrollmentService.myEnrollments(SecurityUtils.currentUser()));
    }
}
