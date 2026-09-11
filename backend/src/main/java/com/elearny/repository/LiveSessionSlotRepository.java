package com.elearny.repository;

import com.elearny.entity.LiveSessionSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveSessionSlotRepository extends JpaRepository<LiveSessionSlot, Long> {
    List<LiveSessionSlot> findByInstructorId(Long instructorId);
    List<LiveSessionSlot> findByCourseId(Long courseId);
}
