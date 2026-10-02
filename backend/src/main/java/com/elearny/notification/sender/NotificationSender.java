package com.elearny.notification.sender;

import com.elearny.notification.NotificationType;
import com.elearny.user.User;









/**
 * FR53: delivery is abstracted behind this interface with three implementations
 * (InAppNotificationSender, EmailNotificationSender, SmsNotificationSender), registered together
 * so triggering code (e.g. CertificateService) fires an event without knowing how delivery happens.
 */
public interface NotificationSender {
    void send(User recipient, NotificationType eventType, String subject, String body, String idempotencyKey);
    String channelName();
}
