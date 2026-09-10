package com.elearny.service.notification;

import com.elearny.entity.*;
import com.elearny.repository.CommunicationLogRepository;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * FR50/FR51: SMS for high-urgency events only (live session reminder, certificate issued,
 * refund approved) — deliberately narrower than email to avoid notification fatigue/cost.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SmsNotificationSender implements NotificationSender {

    private final CommunicationLogRepository communicationLogRepository;

    @Value("${twilio.from-number:}")
    private String fromNumber;

    private static final java.util.Set<NotificationType> SMS_ELIGIBLE = java.util.Set.of(
            NotificationType.LIVE_SESSION_REMINDER, NotificationType.CERTIFICATE_ISSUED, NotificationType.REFUND_STATUS
    );

    @Override
    @Async("notificationExecutor")
    @Retryable(retryFor = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 60000, multiplier = 5))
    public void send(User recipient, NotificationType eventType, String subject, String body, String idempotencyKey) {
        if (!SMS_ELIGIBLE.contains(eventType)) {
            return; // narrower channel list by design (FR50)
        }
        CommunicationLog logEntry = communicationLogRepository.findByIdempotencyKey(idempotencyKey + ":sms")
                .orElseGet(() -> CommunicationLog.builder()
                        .user(recipient).channel(CommunicationChannel.SMS).recipient(recipient.getPhone())
                        .eventType(eventType).idempotencyKey(idempotencyKey + ":sms").attemptCount(0).build());
        logEntry.setAttemptCount(logEntry.getAttemptCount() + 1);
        logEntry.setLastAttemptAt(LocalDateTime.now());
        try {
            Message.creator(new PhoneNumber(recipient.getPhone()), new PhoneNumber(fromNumber), subject).create();
            logEntry.setStatus(CommunicationStatus.SENT);
            communicationLogRepository.save(logEntry);
        } catch (Exception e) {
            logEntry.setStatus(CommunicationStatus.FAILED);
            communicationLogRepository.save(logEntry);
            throw new RuntimeException("SMS send failed, will retry: " + e.getMessage(), e);
        }
    }

    @Recover
    public void recover(Exception e, User recipient, NotificationType eventType, String subject, String body, String idempotencyKey) {
        log.error("SMS delivery permanently failed after retries for {} / {}", recipient.getPhone(), idempotencyKey, e);
        communicationLogRepository.findByIdempotencyKey(idempotencyKey + ":sms").ifPresent(l -> {
            l.setStatus(CommunicationStatus.FAILED);
            communicationLogRepository.save(l);
        });
    }

    @Override
    public String channelName() {
        return "SMS";
    }
}
