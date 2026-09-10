package com.elearny.repository;

import com.elearny.entity.Quiz;
import com.elearny.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuiz(Quiz quiz);
}
