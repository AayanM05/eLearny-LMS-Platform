package com.elearny.livesession;

import com.elearny.user.User;








import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WaitlistEntryRepository extends JpaRepository<WaitlistEntry, Long> {
    List<WaitlistEntry> findBySlotAndStatusOrderByJoinedAtAsc(LiveSessionSlot slot, WaitlistStatus status);
    Optional<WaitlistEntry> findFirstBySlotAndStatusOrderByJoinedAtAsc(LiveSessionSlot slot, WaitlistStatus status);
    Optional<WaitlistEntry> findBySlotAndStudent(LiveSessionSlot slot, User student);
}
