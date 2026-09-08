package com.elearny.practice.repository;

import com.elearny.practice.entity.PracticeProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PracticeProblemRepository extends JpaRepository<PracticeProblem, UUID> {
    Optional<PracticeProblem> findBySlug(String slug);
    List<PracticeProblem> findByDifficultyOrderByCreatedAtDesc(String difficulty);
    List<PracticeProblem> findAllByOrderByCreatedAtDesc();
}
