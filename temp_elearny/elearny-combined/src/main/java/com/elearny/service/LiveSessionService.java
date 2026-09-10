package com.elearny.service;

import com.elearny.dto.request.LiveSessionSlotCreateRequest;
import com.elearny.entity.*;
import com.elearny.exception.AccessDeniedCustomException;
import com.elearny.exception.BusinessRuleException;
import com.elearny.exception.ConflictException;
import com.elearny.exception.ResourceNotFoundException;
import com.elearny.repository.*;
import com.elearny.service.event.WaitlistOfferedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Section 7.12 (Live Sessions & Waitlist): FR12(scheduling conflicts)/FR56-FR58.
 * LiveSessionSlot.bookedCount uses @Version optimistic locking (Section 12.5) so two students
 * booking the last seat concurrently never both succeed.
 */
@Service
@RequiredArgsConstructor
public class LiveSessionService {

    private final LiveSessionSlotRepository slotRepository;
    private final LiveSessionBookingRepository bookingRepository;
    private final WaitlistEntryRepository waitlistRepository;
    private final InstructorLeaveRepository instructorLeaveRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final ApplicationEventPublisher eventPublisher;
    private final com.elearny.service.notification.NotificationDispatcher notificationDispatcher;

    @Transactional
    public LiveSessionSlot createSlot(User instructor, Long courseId, LiveSessionSlotCreateRequest req) {
        Course course = courseService.findEntity(courseId);
        courseService.assertOwnerOrAdmin(instructor, course);
        assertNoConflictWithLeave(instructor, req.startTime().toLocalDate()); // FR57
        assertNoDoubleBooking(instructor, req.startTime(), req.endTime()); // FR12

        LiveSessionSlot slot = LiveSessionSlot.builder()
                .instructor(instructor).course(course).startTime(req.startTime()).endTime(req.endTime())
                .capacity(req.capacity()).bookedCount(0).cancelled(false).build();
        return slotRepository.save(slot);
    }

    private void assertNoConflictWithLeave(User instructor, LocalDate date) {
        if (!instructorLeaveRepository.findActiveOverlapping(instructor, date).isEmpty()) {
            throw new BusinessRuleException("You have marked yourself unavailable on this date."); // FR57
        }
    }

    private void assertNoDoubleBooking(User instructor, LocalDateTime start, LocalDateTime end) {
        boolean overlap = slotRepository.findByInstructorAndStartTimeBetween(instructor, start.minusHours(6), end.plusHours(6))
                .stream().anyMatch(s -> !s.isCancelled() && start.isBefore(s.getEndTime()) && end.isAfter(s.getStartTime()));
        if (overlap) {
            throw new ConflictException("This time slot overlaps with another session you're already hosting."); // FR12
        }
    }

    /** Optimistic-lock protected: retried automatically on version conflict from concurrent bookings. */
    @Transactional
    @Retryable(retryFor = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, backoff = @Backoff(delay = 100))
    public LiveSessionBooking book(User student, Long slotId) {
        LiveSessionSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Live session slot not found"));
        if (slot.isCancelled()) {
            throw new BusinessRuleException("This session has been cancelled.");
        }
        if (!enrollmentRepository.existsByUserAndCourseAndRevokedFalse(student, slot.getCourse())) {
            throw new AccessDeniedCustomException("You must be enrolled in this course to book a live session.");
        }
        bookingRepository.findBySlotAndStudent(slot, student).ifPresent(b -> {
            throw new BusinessRuleException("You already booked this session.");
        });
        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new ConflictException("This session is full. Join the waitlist instead."); // FR58
        }
        slot.setBookedCount(slot.getBookedCount() + 1);
        slotRepository.save(slot);

        LiveSessionBooking booking = LiveSessionBooking.builder()
                .slot(slot).student(student).status(BookingStatus.CONFIRMED).build();
        booking = bookingRepository.save(booking);

        notificationDispatcher.dispatch(student, NotificationType.LIVE_SESSION_BOOKING,
                "You're booked for " + slot.getCourse().getTitle() + " live session",
                "Session starts at " + slot.getStartTime(), "live-booking:" + booking.getId());
        return booking;
    }

    @Transactional
    public void joinWaitlist(User student, Long slotId) {
        LiveSessionSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Live session slot not found"));
        if (slot.getBookedCount() < slot.getCapacity()) {
            throw new BusinessRuleException("Seats are still available; book directly instead of joining the waitlist.");
        }
        waitlistRepository.findBySlotAndStudent(slot, student).ifPresent(w -> {
            throw new BusinessRuleException("You are already on the waitlist for this session.");
        });
        WaitlistEntry entry = WaitlistEntry.builder()
                .slot(slot).student(student).status(WaitlistStatus.WAITING).joinedAt(LocalDateTime.now()).build();
        waitlistRepository.save(entry); // FR58
    }

    /** Called when a confirmed booking is cancelled — offers the freed seat to the next waitlisted student. */
    @Transactional
    public void cancelBooking(User student, Long bookingId) {
        LiveSessionBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new AccessDeniedCustomException("This booking does not belong to you.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        LiveSessionSlot slot = booking.getSlot();
        slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
        slotRepository.save(slot);

        waitlistRepository.findFirstBySlotAndStatusOrderByJoinedAtAsc(slot, WaitlistStatus.WAITING)
                .ifPresent(next -> {
                    next.setStatus(WaitlistStatus.OFFERED);
                    next.setClaimExpiresAt(LocalDateTime.now().plusHours(24)); // FR58: time-boxed claim window
                    waitlistRepository.save(next);
                    eventPublisher.publishEvent(new WaitlistOfferedEvent(next.getId()));
                });
    }

    @Transactional
    public LiveSessionBooking claimWaitlistOffer(User student, Long waitlistEntryId) {
        WaitlistEntry entry = waitlistRepository.findById(waitlistEntryId)
                .orElseThrow(() -> new ResourceNotFoundException("Waitlist entry not found"));
        if (!entry.getStudent().getId().equals(student.getId())) {
            throw new AccessDeniedCustomException("This waitlist offer does not belong to you.");
        }
        if (entry.getStatus() != WaitlistStatus.OFFERED || entry.getClaimExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("This waitlist offer has expired or is no longer available.");
        }
        entry.setStatus(WaitlistStatus.CLAIMED);
        waitlistRepository.save(entry);
        return book(student, entry.getSlot().getId());
    }

    public List<LiveSessionSlot> forCourse(Long courseId) {
        Course course = courseService.findEntity(courseId);
        return slotRepository.findByCourseAndCancelledFalse(course);
    }
}
