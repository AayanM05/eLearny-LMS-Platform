package com.elearny.review.controller;

import com.elearny.review.entity.Review;
import com.elearny.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/course/{courseId}")
    public ResponseEntity<Review> addReview(
            @AuthenticationPrincipal String userId,
            @PathVariable UUID courseId,
            @RequestParam int rating,
            @RequestBody(required = false) String comment) {
        Review review = reviewService.addReview(UUID.fromString(userId), courseId, rating, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Review>> getCourseReviews(@PathVariable UUID courseId) {
        List<Review> reviews = reviewService.getCourseReviews(courseId);
        return ResponseEntity.ok(reviews);
    }
}
