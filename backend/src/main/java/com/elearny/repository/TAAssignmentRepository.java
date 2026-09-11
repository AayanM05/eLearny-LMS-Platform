package com.elearny.repository;

import com.elearny.entity.TAAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TAAssignmentRepository extends JpaRepository<TAAssignment, Long> {
    List<TAAssignment> findByCourseId(Long courseId);
    List<TAAssignment> findByTaId(Long taId);
    boolean existsByCourseIdAndTaId(Long courseId, Long taId);
}
