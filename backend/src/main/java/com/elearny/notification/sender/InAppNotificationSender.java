package com.elearny.notification.sender;

import com.elearny.notification.Notification;
import com.elearny.notification.NotificationRepository;
import com.elearny.notification.NotificationType;
import com.elearny.user.User;








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
