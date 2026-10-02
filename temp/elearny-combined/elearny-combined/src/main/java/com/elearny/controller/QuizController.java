package com.elearny.controller;

import com.elearny.dto.request.QuizAttemptRequest;
import com.elearny.dto.request.QuizCreateRequest;
import com.elearny.dto.response.QuizAttemptResponse;
import com.elearny.dto.response.QuizResponse;
import com.elearny.entity.Quiz;
import com.elearny.entity.QuizAttempt;
import com.elearny.repository.QuizRepository;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.service.CourseContentService;
import com.elearny.service.QuizService;
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
@Tag(name = "Quizzes", description = "FR13-FR15")
public class QuizController {

    private final QuizService quizService;
    private final QuizRepository quizRepository;
    private final CourseContentService courseContentService;

    @PostMapping("/api/subsections/{subsectionId}/quiz")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Quiz> create(@PathVariable Long subsectionId, @Valid @RequestBody QuizCreateRequest req) {
        return ResponseEntity.ok(quizService.createQuiz(SecurityUtils.currentUser(), subsectionId, req));
    }

    /** Student-safe view: resolves "this sub-section is a QUIZ" into questions/options WITHOUT the answer key. */
    @GetMapping("/api/subsections/{subsectionId}/quiz")
    public ResponseEntity<QuizResponse> getBySubsection(@PathVariable Long subsectionId) {
        var subsection = courseContentService.findSubsection(subsectionId);
        Quiz quiz = quizRepository.findBySubsection(subsection)
                .orElseThrow(() -> new ResourceNotFoundException("No quiz configured for this sub-section yet."));
        return ResponseEntity.ok(QuizResponse.from(quiz));
    }

    @PostMapping("/api/quizzes/{quizId}/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizAttemptResponse> attempt(@PathVariable Long quizId, @Valid @RequestBody QuizAttemptRequest req) {
        return ResponseEntity.ok(quizService.attempt(SecurityUtils.currentUser(), quizId, req));
    }

    @GetMapping("/api/quizzes/{quizId}/attempts/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<QuizAttempt>> history(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.history(SecurityUtils.currentUser(), quizId));
    }
}
