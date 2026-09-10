package com.elearny.repository;

import com.elearny.entity.Course;
import com.elearny.entity.LiveSessionSlot;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LiveSessionSlotRepository extends JpaRepository<LiveSessionSlot, Long> {
    List<LiveSessionSlot> findByCourseAndCancelledFalse(Course course);
    List<LiveSessionSlot> findByInstructorAndStartTimeBetween(User instructor, LocalDateTime from, LocalDateTime to);

    @Query("select s from LiveSessionSlot s where s.startTime between :from and :to and s.cancelled = false")
    List<LiveSessionSlot> findUpcomingReminderWindow(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
