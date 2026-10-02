package com.elearny.exam;

import com.elearny.course.Subsection;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findBySubsection(Subsection subsection);
}
