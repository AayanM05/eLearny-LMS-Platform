package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.TaAssignment;
import com.elearny.entity.TaStatus;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaAssignmentRepository extends JpaRepository<TaAssignment, Long> {
    List<TaAssignment> findByTaUserAndStatus(User taUser, TaStatus status);
    List<TaAssignment> findByTaUser(User taUser);
    List<TaAssignment> findByCourseAndStatusNot(Course course, TaStatus status);
    Optional<TaAssignment> findByCourseAndTaUser(Course course, User taUser);
    boolean existsByCourseAndTaUserAndStatus(Course course, User taUser, TaStatus status);
}
