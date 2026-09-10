package com.elearny.controller;

import com.elearny.dto.request.LiveSessionSlotCreateRequest;
import com.elearny.entity.LiveSessionBooking;
import com.elearny.entity.LiveSessionSlot;
import com.elearny.service.LiveSessionService;
import com.elearny.util.SecurityUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Live Sessions", description = "FR12/FR57/FR58")
public class LiveSessionController {

    private final LiveSessionService liveSessionService;

    @PostMapping("/api/courses/{courseId}/live-sessions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<LiveSessionSlot> create(@PathVariable Long courseId, @Valid @RequestBody LiveSessionSlotCreateRequest req) {
        return ResponseEntity.ok(liveSessionService.createSlot(SecurityUtils.currentUser(), courseId, req));
    }

    @GetMapping("/api/courses/{courseId}/live-sessions")
    public ResponseEntity<List<LiveSessionSlot>> list(@PathVariable Long courseId) {
        return ResponseEntity.ok(liveSessionService.forCourse(courseId));
    }

    @PostMapping("/api/live-sessions/{slotId}/book")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LiveSessionBooking> book(@PathVariable Long slotId) {
        return ResponseEntity.ok(liveSessionService.book(SecurityUtils.currentUser(), slotId));
    }

    @PostMapping("/api/live-sessions/{slotId}/waitlist")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> joinWaitlist(@PathVariable Long slotId) {
        liveSessionService.joinWaitlist(SecurityUtils.currentUser(), slotId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/live-session-bookings/{bookingId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> cancel(@PathVariable Long bookingId) {
        liveSessionService.cancelBooking(SecurityUtils.currentUser(), bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/waitlist-entries/{entryId}/claim")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LiveSessionBooking> claim(@PathVariable Long entryId) {
        return ResponseEntity.ok(liveSessionService.claimWaitlistOffer(SecurityUtils.currentUser(), entryId));
    }
}
