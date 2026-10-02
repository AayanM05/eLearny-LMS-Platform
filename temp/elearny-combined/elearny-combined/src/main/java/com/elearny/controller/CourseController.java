package com.elearny.controller;

import com.elearny.dto.request.CourseCreateRequest;
import com.elearny.dto.response.CourseResponse;
import com.elearny.service.CourseService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "FR7-FR12")
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<java.util.List<CourseResponse>> mine() {
        return ResponseEntity.ok(courseService.myCourses(SecurityUtils.currentUser()));
    }

    @GetMapping
    public ResponseEntity<Page<CourseResponse>> browse(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            Pageable pageable) {
        return ResponseEntity.ok(courseService.browse(categoryId, q, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getDetail(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseCreateRequest req) {
        return ResponseEntity.ok(courseService.createCourse(SecurityUtils.currentUser(), req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<CourseResponse> update(@PathVariable Long id, @Valid @RequestBody CourseCreateRequest req) {
        return ResponseEntity.ok(courseService.update(SecurityUtils.currentUser(), id, req));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Void> publish(@PathVariable Long id) {
        courseService.setPublished(SecurityUtils.currentUser(), id, true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unpublish")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Void> unpublish(@PathVariable Long id) {
        courseService.setPublished(SecurityUtils.currentUser(), id, false);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        courseService.deactivate(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }
}
