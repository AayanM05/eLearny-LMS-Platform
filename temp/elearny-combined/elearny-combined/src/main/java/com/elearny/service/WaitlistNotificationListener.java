package com.elearny.service;

import com.elearny.entity.NotificationType;
import com.elearny.entity.WaitlistEntry;
import com.elearny.repository.WaitlistEntryRepository;
import com.elearny.service.event.WaitlistOfferedEvent;
import com.elearny.service.notification.NotificationDispatcher;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class WaitlistNotificationListener {

    private final WaitlistEntryRepository waitlistEntryRepository;
    private final NotificationDispatcher notificationDispatcher;

    @Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOffered(WaitlistOfferedEvent event) {
        WaitlistEntry entry = waitlistEntryRepository.findById(event.waitlistEntryId()).orElse(null);
        if (entry == null) return;
        notificationDispatcher.dispatch(entry.getStudent(), NotificationType.WAITLIST_CLAIM_OFFER,
                "A seat opened up!",
                "A seat for " + entry.getSlot().getCourse().getTitle()
                        + " is now available. Claim it within 24 hours before it's offered to the next person.",
                "waitlist-offer:" + entry.getId());
    }
}
