package com.elearny.assignment;

import com.elearny.course.Subsection;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findBySubsection(Subsection subsection);
}
