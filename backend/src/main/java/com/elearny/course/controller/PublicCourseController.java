package com.elearny.course.controller;

import com.elearny.course.dto.CourseResponse;
import com.elearny.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class PublicCourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getPublishedCourses(
            @RequestParam(required = false) String category) {
        List<CourseResponse> response = courseService.getPublishedCourses(category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CourseResponse> getCourseBySlug(@PathVariable String slug) {
        CourseResponse response = courseService.getCourseBySlug(slug);
        return ResponseEntity.ok(response);
    }
}
