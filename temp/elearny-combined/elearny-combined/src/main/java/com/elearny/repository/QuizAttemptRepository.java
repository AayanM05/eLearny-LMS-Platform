package com.elearny.repository;

import com.elearny.entity.Quiz;
import com.elearny.entity.QuizAttempt;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizAndStudentOrderByAttemptedAtDesc(Quiz quiz, User student);
    boolean existsByQuizAndStudentAndPassedTrue(Quiz quiz, User student);
}
