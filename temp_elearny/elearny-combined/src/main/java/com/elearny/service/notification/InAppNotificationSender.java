package com.elearny.service.notification;

import com.elearny.entity.Notification;
import com.elearny.entity.NotificationType;
import com.elearny.entity.User;
import com.elearny.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InAppNotificationSender implements NotificationSender {

    private final NotificationRepository notificationRepository;

    @Override
    public void send(User recipient, NotificationType eventType, String subject, String body, String idempotencyKey) {
        Notification n = Notification.builder()
                .user(recipient)
                .message(subject + (body != null ? " - " + body : ""))
                .type(eventType)
                .read(false)
                .build();
        notificationRepository.save(n);
    }

    @Override
    public String channelName() {
        return "IN_APP";
    }
}
