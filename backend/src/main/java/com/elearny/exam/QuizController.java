package com.elearny.exam;

import com.elearny.common.exception.ResourceNotFoundException;
import com.elearny.common.util.SecurityUtils;
import com.elearny.course.CourseContentService;
import com.elearny.exam.dto.QuizAttemptRequest;
import com.elearny.exam.dto.QuizAttemptResponse;
import com.elearny.exam.dto.QuizCreateRequest;
import com.elearny.exam.dto.QuizResponse;








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
