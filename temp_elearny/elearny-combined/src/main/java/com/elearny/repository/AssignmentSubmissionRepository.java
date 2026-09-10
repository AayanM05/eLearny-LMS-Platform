package com.elearny.repository;

import com.elearny.entity.Assignment;
import com.elearny.entity.AssignmentSubmission;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentAndStudentOrderBySubmittedAtDesc(Assignment assignment, User student);
    Optional<AssignmentSubmission> findFirstByAssignmentAndStudentAndSupersededFalse(Assignment assignment, User student);
    boolean existsByAssignmentAndStudentAndGradeIsNotNull(Assignment assignment, User student);
    List<AssignmentSubmission> findByAssignmentAndSupersededFalseOrderBySubmittedAtDesc(Assignment assignment);
}
