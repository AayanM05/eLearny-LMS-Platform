package com.elearny.notification.listener;

import com.elearny.community.ForumReply;
import com.elearny.community.ForumReplyRepository;
import com.elearny.notification.NotificationType;
import com.elearny.notification.event.ForumReplyEvent;
import com.elearny.notification.sender.NotificationDispatcher;








import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class ForumNotificationListener {

    private final ForumReplyRepository forumReplyRepository;
    private final NotificationDispatcher notificationDispatcher;

    @Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onReply(ForumReplyEvent event) {
        ForumReply reply = forumReplyRepository.findById(event.replyId()).orElse(null);
        if (reply == null) return;
        var originalPoster = reply.getThread().getStudent();
        if (originalPoster.getId().equals(reply.getUser().getId())) return; // don't notify yourself
        notificationDispatcher.dispatch(originalPoster, NotificationType.FORUM_REPLY,
                reply.getUser().getName() + " replied to your question",
                reply.getReplyText(),
                "forum-reply:" + reply.getId());
    }
}
