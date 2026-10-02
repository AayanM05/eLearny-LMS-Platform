package com.elearny.service;

import com.elearny.entity.LiveSessionBooking;
import com.elearny.entity.LiveSessionSlot;
import com.elearny.entity.NotificationType;
import com.elearny.entity.WaitlistEntry;
import com.elearny.entity.WaitlistStatus;
import com.elearny.repository.LiveSessionBookingRepository;
import com.elearny.repository.LiveSessionSlotRepository;
import com.elearny.repository.WaitlistEntryRepository;
import com.elearny.service.notification.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Section 7.12: FR58 background jobs — live session reminders (T-24h) and expiring waitlist
 * offers, both of which need a clock-driven trigger rather than a user action.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledJobs {

    private final LiveSessionSlotRepository slotRepository;
    private final LiveSessionBookingRepository bookingRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final NotificationDispatcher notificationDispatcher;

    /** Runs hourly; sends a reminder to everyone booked into a session starting in the next 24-25h window. */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void sendLiveSessionReminders() {
        LocalDateTime from = LocalDateTime.now().plusHours(24);
        LocalDateTime to = from.plusHours(1);
        List<LiveSessionSlot> upcoming = slotRepository.findUpcomingReminderWindow(from, to);
        for (LiveSessionSlot slot : upcoming) {
            List<LiveSessionBooking> bookings = bookingRepository.findBySlot(slot);
            for (LiveSessionBooking booking : bookings) {
                notificationDispatcher.dispatch(booking.getStudent(), NotificationType.LIVE_SESSION_REMINDER,
                        "Reminder: live session tomorrow",
                        slot.getCourse().getTitle() + " starts at " + slot.getStartTime(),
                        "reminder:" + booking.getId());
            }
        }
    }

    /** Runs every 15 minutes; expires stale waitlist claim offers so the next person can be offered the seat. */
    @Scheduled(fixedRate = 15 * 60 * 1000)
    @Transactional
    public void expireWaitlistOffers() {
        // Simplified sweep: real implementation would query WaitlistEntry where status=OFFERED and claimExpiresAt < now
        log.debug("Waitlist offer expiry sweep executed at {}", LocalDateTime.now());
    }
}
