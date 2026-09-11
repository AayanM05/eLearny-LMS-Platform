package com.elearny.controller;

import com.elearny.dto.*;
import com.elearny.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CourseCreateRequest request) {
        CourseResponse response = courseService.createCourse(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Course draft created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublishedCourses() {
        List<CourseResponse> response = courseService.getPublishedCourses();
        return ResponseEntity.ok(ApiResponse.success(response, "Published courses retrieved successfully"));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CourseResponse> response = courseService.getMyCourses(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Instructor courses retrieved successfully"));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseBySlug(@PathVariable String slug) {
        CourseResponse response = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response, "Course details retrieved successfully"));
    }

    @PostMapping("/{id}/sections")
    public ResponseEntity<ApiResponse<CourseSectionResponse>> addSection(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CourseSectionRequest request) {
        CourseSectionResponse response = courseService.addSection(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Section added successfully"));
    }

    @PostMapping("/sections/{sectionId}/lessons")
    public ResponseEntity<ApiResponse<CourseLessonResponse>> addLesson(
            @PathVariable Long sectionId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CourseLessonRequest request) {
        CourseLessonResponse response = courseService.addLesson(sectionId, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson added successfully"));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        CourseResponse response = courseService.publishCourse(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Course published successfully"));
    }
}
