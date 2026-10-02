package com.elearny.backend.instructor.repository;

import com.elearny.backend.instructor.entity.ApplicationStatus;
import com.elearny.backend.instructor.entity.InstructorApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, UUID> {

    List<InstructorApplication> findAllByStatusOrderByCreatedAtAsc(ApplicationStatus status);

    Optional<InstructorApplication> findFirstByApplicantIdAndStatus(UUID applicantId, ApplicationStatus status);
}
