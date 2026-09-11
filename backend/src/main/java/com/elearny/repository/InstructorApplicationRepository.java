package com.elearny.repository;

import com.elearny.entity.InstructorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, Long> {
    Optional<InstructorApplication> findByUserId(Long userId);
    List<InstructorApplication> findByStatus(String status);
    boolean existsByUserIdAndStatus(Long userId, String status);
}
