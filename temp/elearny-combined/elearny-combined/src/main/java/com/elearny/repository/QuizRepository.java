package com.elearny.repository;

import com.elearny.entity.Quiz;
import com.elearny.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findBySubsection(Subsection subsection);
}
