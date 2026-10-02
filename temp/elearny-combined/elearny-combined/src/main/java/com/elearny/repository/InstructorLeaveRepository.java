package com.elearny.repository;

import com.elearny.entity.InstructorLeave;
import com.elearny.entity.LeaveStatus;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InstructorLeaveRepository extends JpaRepository<InstructorLeave, Long> {
    List<InstructorLeave> findByInstructorAndStatus(User instructor, LeaveStatus status);

    @Query("select l from InstructorLeave l where l.instructor = :instructor and l.status = 'ACTIVE' " +
           "and l.startDate <= :date and l.endDate >= :date")
    List<InstructorLeave> findActiveOverlapping(@Param("instructor") User instructor, @Param("date") LocalDate date);
}
