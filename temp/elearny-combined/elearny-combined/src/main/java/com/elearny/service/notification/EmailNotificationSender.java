package com.elearny.service.notification;

import com.elearny.entity.*;
import com.elearny.repository.CommunicationLogRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * FR48/FR49/FR51 + Section 8.1: real SMTP delivery, async, retried with exponential backoff
 * (1min -> 5min -> 15min, 3 attempts), logged to CommunicationLog either way so failures are
 * never silent.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;
    private final CommunicationLogRepository communicationLogRepository;

    @Override
    @Async("notificationExecutor")
    @Retryable(retryFor = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 60000, multiplier = 5))
    public void send(User recipient, NotificationType eventType, String subject, String htmlBody, String idempotencyKey) {
        if (communicationLogRepository.findByIdempotencyKey(idempotencyKey).filter(l -> l.getStatus() == CommunicationStatus.SENT).isPresent()) {
            log.info("Skipping duplicate email send for idempotency key {}", idempotencyKey);
            return;
        }
        CommunicationLog logEntry = communicationLogRepository.findByIdempotencyKey(idempotencyKey)
                .orElseGet(() -> CommunicationLog.builder()
                        .user(recipient).channel(CommunicationChannel.EMAIL).recipient(recipient.getEmail())
                        .eventType(eventType).idempotencyKey(idempotencyKey).attemptCount(0).build());
        logEntry.setAttemptCount(logEntry.getAttemptCount() + 1);
        logEntry.setLastAttemptAt(LocalDateTime.now());

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(recipient.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            logEntry.setStatus(CommunicationStatus.SENT);
            communicationLogRepository.save(logEntry);
        } catch (Exception e) {
            logEntry.setStatus(CommunicationStatus.FAILED);
            communicationLogRepository.save(logEntry);
            throw new RuntimeException("Email send failed, will retry: " + e.getMessage(), e);
        }
    }

    @Recover
    public void recover(Exception e, User recipient, NotificationType eventType, String subject, String htmlBody, String idempotencyKey) {
        log.error("Email delivery permanently failed after retries for {} / {}", recipient.getEmail(), idempotencyKey, e);
        communicationLogRepository.findByIdempotencyKey(idempotencyKey).ifPresent(l -> {
            l.setStatus(CommunicationStatus.FAILED);
            communicationLogRepository.save(l);
        });
    }

    @Override
    public String channelName() {
        return "EMAIL";
    }
}
