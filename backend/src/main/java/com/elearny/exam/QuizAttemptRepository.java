package com.elearny.exam;

import com.elearny.user.User;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizAndStudentOrderByAttemptedAtDesc(Quiz quiz, User student);
    boolean existsByQuizAndStudentAndPassedTrue(Quiz quiz, User student);
}
