package com.elearny.practice.controller;

import com.elearny.practice.dto.*;
import com.elearny.practice.service.PracticeHubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/practice")
@RequiredArgsConstructor
public class PracticeHubController {

    private final PracticeHubService practiceHubService;

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDto>> getAllArticles() {
        return ResponseEntity.ok(practiceHubService.getAllArticles());
    }

    @GetMapping("/articles/{slug}")
    public ResponseEntity<ArticleDto> getArticleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(practiceHubService.getArticleBySlug(slug));
    }

    @GetMapping("/problems")
    public ResponseEntity<List<PracticeProblemDto>> getAllProblems() {
        return ResponseEntity.ok(practiceHubService.getAllProblems());
    }

    @GetMapping("/problems/{slug}")
    public ResponseEntity<PracticeProblemDto> getProblemBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(practiceHubService.getProblemBySlug(slug));
    }

    @PostMapping("/submit-code")
    public ResponseEntity<CodeSubmissionResponse> submitCode(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody SubmitCodeRequest request) {
        CodeSubmissionResponse response = practiceHubService.submitCode(UUID.fromString(userId), request);
        return ResponseEntity.ok(response);
    }
}
