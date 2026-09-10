package com.elearny.repository;

import com.elearny.entity.Assignment;
import com.elearny.entity.Subsection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findBySubsection(Subsection subsection);
}
