package com.elearny.practice.repository;

import com.elearny.practice.entity.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, UUID> {
    List<CodeSubmission> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<CodeSubmission> findByProblemIdAndUserIdOrderByCreatedAtDesc(UUID problemId, UUID userId);
}
