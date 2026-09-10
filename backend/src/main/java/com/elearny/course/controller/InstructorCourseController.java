package com.elearny.course.controller;

import com.elearny.course.dto.*;
import com.elearny.course.entity.CourseStatus;
import com.elearny.course.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instructor/courses")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
public class InstructorCourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateCourseRequest request) {
        CourseResponse response = courseService.createCourse(UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getMyCourses(
            @AuthenticationPrincipal String userId) {
        List<CourseResponse> response = courseService.getCoursesByInstructor(UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseResponse> getCourseById(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal String userId) {
        CourseResponse response = courseService.getCourseById(courseId, UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateCourseRequest request) {
        CourseResponse response = courseService.updateCourse(courseId, UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/sections")
    public ResponseEntity<SectionResponse> addSection(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateSectionRequest request) {
        SectionResponse response = courseService.addSection(courseId, UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/sections/{sectionId}")
    public ResponseEntity<SectionResponse> updateSection(
            @PathVariable UUID sectionId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateSectionRequest request) {
        SectionResponse response = courseService.updateSection(sectionId, UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/sections/{sectionId}")
    public ResponseEntity<Void> deleteSection(
            @PathVariable UUID sectionId,
            @AuthenticationPrincipal String userId) {
        courseService.deleteSection(sectionId, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sections/{sectionId}/lessons")
    public ResponseEntity<LessonResponse> addLesson(
            @PathVariable UUID sectionId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateLessonRequest request) {
        LessonResponse response = courseService.addLesson(sectionId, UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/sections/lessons/{lessonId}")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CreateLessonRequest request) {
        LessonResponse response = courseService.updateLesson(lessonId, UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/sections/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal String userId) {
        courseService.deleteLesson(lessonId, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{courseId}/status")
    public ResponseEntity<CourseResponse> updateStatus(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal String userId,
            @RequestParam CourseStatus status) {
        CourseResponse response = courseService.updateCourseStatus(courseId, UUID.fromString(userId), status);
        return ResponseEntity.ok(response);
    }
}
