package com.elearny.repository;

import com.elearny.entity.LiveSessionBooking;
import com.elearny.entity.LiveSessionSlot;
import com.elearny.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LiveSessionBookingRepository extends JpaRepository<LiveSessionBooking, Long> {
    Optional<LiveSessionBooking> findBySlotAndStudent(LiveSessionSlot slot, User student);
    List<LiveSessionBooking> findBySlot(LiveSessionSlot slot);
}
