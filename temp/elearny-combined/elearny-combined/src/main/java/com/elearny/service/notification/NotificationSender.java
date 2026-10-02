package com.elearny.service.notification;

import com.elearny.entity.NotificationType;
import com.elearny.entity.User;

/**
 * FR53: delivery is abstracted behind this interface with three implementations
 * (InAppNotificationSender, EmailNotificationSender, SmsNotificationSender), registered together
 * so triggering code (e.g. CertificateService) fires an event without knowing how delivery happens.
 */
public interface NotificationSender {
    void send(User recipient, NotificationType eventType, String subject, String body, String idempotencyKey);
    String channelName();
}
