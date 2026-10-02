package com.elearny.dto.response;

import com.elearny.entity.Quiz;
import com.elearny.entity.QuizQuestion;

import java.util.List;

/**
 * Student-safe view of a Quiz: deliberately omits QuizQuestion.correctOption so the answer key
 * is never sent to the browser before an attempt is graded server-side (see QuizService.attempt).
 */
public record QuizResponse(
        Long id, Integer passThresholdPercent, boolean allowMultipleAttempts, List<QuestionView> questions
) {
    public record QuestionView(Long id, String questionText, String optionsJson) {}

    public static QuizResponse from(Quiz quiz) {
        List<QuestionView> questions = quiz.getQuestions().stream()
                .map(q -> new QuestionView(q.getId(), q.getQuestionText(), q.getOptionsJson()))
                .toList();
        return new QuizResponse(quiz.getId(), quiz.getPassThresholdPercent(), quiz.isAllowMultipleAttempts(), questions);
    }
}
