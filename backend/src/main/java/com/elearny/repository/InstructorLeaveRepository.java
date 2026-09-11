package com.elearny.repository;

import com.elearny.entity.InstructorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorLeaveRepository extends JpaRepository<InstructorLeave, Long> {
    List<InstructorLeave> findByInstructorId(Long instructorId);
}
