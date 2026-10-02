package com.elearny.backend.course.controller;

import com.elearny.backend.course.dto.CourseDetailResponse;
import com.elearny.backend.course.dto.CourseResponse;
import com.elearny.backend.course.dto.CreateLessonRequest;
import com.elearny.backend.course.dto.CreateSectionRequest;
import com.elearny.backend.course.dto.LessonResponse;
import com.elearny.backend.course.dto.SaveCourseRequest;
import com.elearny.backend.course.dto.SectionResponse;
import com.elearny.backend.course.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Every endpoint here is scoped to "my own courses" via the authenticated
 * instructorId — there is no admin-style "any course by ID" endpoint in
 * this controller. CourseService's findOwnedCourse enforces this at the
 * service layer too (not just via @PreAuthorize), so a bug in this
 * controller's routing couldn't accidentally expose another instructor's
 * unpublished course.
 */
@RestController
@RequestMapping("/api/v1/instructor/courses")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse create(@AuthenticationPrincipal UUID instructorId, @Valid @RequestBody SaveCourseRequest request) {
        return courseService.createCourse(instructorId, request);
    }

    @GetMapping
    public List<CourseResponse> listMine(@AuthenticationPrincipal UUID instructorId) {
        return courseService.listByInstructor(instructorId);
    }

    @GetMapping("/{id}")
    public CourseDetailResponse getDetail(@AuthenticationPrincipal UUID instructorId, @PathVariable UUID id) {
        return courseService.getDetail(instructorId, id);
    }

    @PutMapping("/{id}")
    public CourseResponse update(
            @AuthenticationPrincipal UUID instructorId,
            @PathVariable UUID id,
            @Valid @RequestBody SaveCourseRequest request
    ) {
        return courseService.updateCourse(instructorId, id, request);
    }

    @PostMapping("/{id}/publish")
    public CourseResponse publish(@AuthenticationPrincipal UUID instructorId, @PathVariable UUID id) {
        return courseService.publish(instructorId, id);
    }

    @PostMapping("/{id}/sections")
    @ResponseStatus(HttpStatus.CREATED)
    public SectionResponse addSection(
            @AuthenticationPrincipal UUID instructorId,
            @PathVariable UUID id,
            @Valid @RequestBody CreateSectionRequest request
    ) {
        return courseService.addSection(instructorId, id, request);
    }

    @PostMapping("/{id}/sections/{sectionId}/lessons")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonResponse addLesson(
            @AuthenticationPrincipal UUID instructorId,
            @PathVariable UUID id,
            @PathVariable UUID sectionId,
            @Valid @RequestBody CreateLessonRequest request
    ) {
        return courseService.addLesson(instructorId, id, sectionId, request);
    }
}
