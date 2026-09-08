package com.elearny.instructor.repository;

import com.elearny.instructor.entity.ApplicationStatus;
import com.elearny.instructor.entity.InstructorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, UUID> {
    Optional<InstructorApplication> findByUserId(UUID userId);
    List<InstructorApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);
}
