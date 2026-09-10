package com.elearny.service.notification;

import com.elearny.entity.NotificationType;
import com.elearny.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Fans a single business event out to every registered NotificationSender (in-app, email, SMS).
 * Each sender internally decides whether the event is relevant to its channel (e.g. SmsNotificationSender
 * only acts on the narrow high-urgency list from FR50).
 */
@Service
@RequiredArgsConstructor
public class NotificationDispatcher {

    private final List<NotificationSender> senders;

    public void dispatch(User recipient, NotificationType eventType, String subject, String body, String idempotencyKey) {
        for (NotificationSender sender : senders) {
            sender.send(recipient, eventType, subject, body, idempotencyKey);
        }
    }
}
