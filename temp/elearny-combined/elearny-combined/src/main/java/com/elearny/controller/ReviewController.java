package com.elearny.controller;

import com.elearny.dto.request.ReviewCreateRequest;
import com.elearny.dto.response.ReviewResponse;
import com.elearny.service.ReviewService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "FR25/FR26")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/courses/{courseId}/reviews")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ReviewResponse> create(@PathVariable Long courseId, @Valid @RequestBody ReviewCreateRequest req) {
        return ResponseEntity.ok(reviewService.create(SecurityUtils.currentUser(), courseId, req));
    }

    @GetMapping("/api/courses/{courseId}/reviews")
    public ResponseEntity<List<ReviewResponse>> list(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewService.forCourse(courseId));
    }
}
