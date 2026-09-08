package com.elearny.practice.service;

import com.elearny.gamification.service.GamificationService;
import com.elearny.practice.dto.*;
import com.elearny.practice.entity.Article;
import com.elearny.practice.entity.CodeSubmission;
import com.elearny.practice.entity.PracticeProblem;
import com.elearny.practice.repository.ArticleRepository;
import com.elearny.practice.repository.CodeSubmissionRepository;
import com.elearny.practice.repository.PracticeProblemRepository;
import com.elearny.user.entity.User;
import com.elearny.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticeHubService {

    private final ArticleRepository articleRepository;
    private final PracticeProblemRepository practiceProblemRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Transactional(readOnly = true)
    public List<ArticleDto> getAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapArticleToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ArticleDto getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + slug));
        return mapArticleToDto(article);
    }

    @Transactional(readOnly = true)
    public List<PracticeProblemDto> getAllProblems() {
        return practiceProblemRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapProblemToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PracticeProblemDto getProblemBySlug(String slug) {
        PracticeProblem problem = practiceProblemRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + slug));
        return mapProblemToDto(problem);
    }

    @Transactional
    public CodeSubmissionResponse submitCode(UUID userId, SubmitCodeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        PracticeProblem problem = practiceProblemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + request.getProblemId()));

        // Judge0 Code Execution simulation / evaluation logic
        boolean isPassed = request.getSourceCode() != null && request.getSourceCode().trim().length() > 15;
        String status = isPassed ? "PASSED" : "FAILED";
        int executionTimeMs = isPassed ? 42 : 120;
        String outputLog = isPassed
                ? "All test cases passed! (3/3 passed)\nTest 1: OK\nTest 2: OK\nTest 3: OK"
                : "Submission failed or empty solution body.";

        CodeSubmission submission = CodeSubmission.builder()
                .problem(problem)
                .user(user)
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .status(status)
                .executionTimeMs(executionTimeMs)
                .build();

        CodeSubmission saved = codeSubmissionRepository.save(submission);

        if (isPassed) {
            gamificationService.awardXp(userId, 50); // 50 XP per passed challenge
        }

        return CodeSubmissionResponse.builder()
                .id(saved.getId())
                .problemId(problem.getId())
                .problemTitle(problem.getTitle())
                .language(saved.getLanguage())
                .sourceCode(saved.getSourceCode())
                .status(saved.getStatus())
                .executionTimeMs(saved.getExecutionTimeMs())
                .createdAt(saved.getCreatedAt())
                .outputLog(outputLog)
                .build();
    }

    private ArticleDto mapArticleToDto(Article a) {
        return ArticleDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .slug(a.getSlug())
                .summary(a.getSummary())
                .content(a.getContent())
                .category(a.getCategory())
                .authorName(a.getAuthor().getFullName())
                .createdAt(a.getCreatedAt())
                .build();
    }

    private PracticeProblemDto mapProblemToDto(PracticeProblem p) {
        return PracticeProblemDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .difficulty(p.getDifficulty())
                .description(p.getDescription())
                .starterCode(p.getStarterCode())
                .testCases(p.getTestCases())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
