package com.elearny.repository;

import com.elearny.entity.LiveSessionBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveSessionBookingRepository extends JpaRepository<LiveSessionBooking, Long> {
    List<LiveSessionBooking> findBySlotId(Long slotId);
    List<LiveSessionBooking> findByStudentId(Long studentId);
    Optional<LiveSessionBooking> findBySlotIdAndStudentId(Long slotId, Long studentId);
    long countBySlotId(Long slotId);
}
