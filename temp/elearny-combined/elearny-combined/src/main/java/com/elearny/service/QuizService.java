package com.elearny.service;

import com.elearny.dto.request.QuizAttemptRequest;
import com.elearny.dto.request.QuizCreateRequest;
import com.elearny.dto.response.QuizAttemptResponse;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.EnrollmentRepository;
import com.elearny.repository.QuizAttemptRepository;
import com.elearny.repository.QuizQuestionRepository;
import com.elearny.repository.QuizRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/** Section 7.3 (Quiz & Assessment): FR13-FR15. */
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseContentService courseContentService;
    private final CourseService courseService;
    private final ProgressService progressService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    @SneakyThrows
    public Quiz createQuiz(User requester, Long subsectionId, QuizCreateRequest req) {
        Subsection subsection = courseContentService.findSubsection(subsectionId);
        if (subsection.getContentType() != ContentType.QUIZ) {
            throw new BusinessRuleException("Sub-section is not of type QUIZ.");
        }
        courseService.assertOwnerOrAdmin(requester, subsection.getSection().getCourse());

        Quiz quiz = Quiz.builder()
                .subsection(subsection)
                .passThresholdPercent(req.passThresholdPercent())
                .allowMultipleAttempts(req.allowMultipleAttempts() == null || req.allowMultipleAttempts())
                .build();
        quiz = quizRepository.save(quiz);
        for (QuizCreateRequest.QuizQuestionRequest q : req.questions()) {
            QuizQuestion question = QuizQuestion.builder()
                    .quiz(quiz).questionText(q.questionText())
                    .optionsJson(objectMapper.writeValueAsString(q.options()))
                    .correctOption(q.correctOption())
                    .build();
            quizQuestionRepository.save(question);
        }
        return quiz;
    }

    @Transactional
    public QuizAttemptResponse attempt(User student, Long quizId, QuizAttemptRequest req) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        Course course = quiz.getSubsection().getSection().getCourse();
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, course)) {
            throw new AccessDeniedCustomException("You must be enrolled to attempt this quiz.");
        }
        if (!quiz.isAllowMultipleAttempts()
                && quizAttemptRepository.existsByQuizAndStudentAndPassedTrue(quiz, student)) {
            throw new BusinessRuleException("Multiple attempts are not allowed for this quiz, and you've already passed it.");
        }

        List<QuizQuestion> questions = quiz.getQuestions();
        long correctCount = questions.stream()
                .filter(q -> req.answers().getOrDefault(q.getId(), "").equalsIgnoreCase(q.getCorrectOption()))
                .count();
        int scorePercent = questions.isEmpty() ? 0 : (int) Math.round(correctCount * 100.0 / questions.size());
        boolean passed = scorePercent >= quiz.getPassThresholdPercent();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz).student(student).scorePercent(scorePercent).passed(passed)
                .attemptedAt(LocalDateTime.now()).build();
        quizAttemptRepository.save(attempt);

        if (passed) {
            progressService.markCompleteSystem(student, quiz.getSubsection()); // FR15
        }
        return new QuizAttemptResponse(scorePercent, passed);
    }

    public List<QuizAttempt> history(User student, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return quizAttemptRepository.findByQuizAndStudentOrderByAttemptedAtDesc(quiz, student);
    }
}
