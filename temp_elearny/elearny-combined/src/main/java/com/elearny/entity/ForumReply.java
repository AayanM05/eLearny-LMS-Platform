package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "forum_replies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ForumReply extends BaseEntity {

    // Defensive fix: not currently reachable (ForumController only returns DTOs), but the same
    // cycle exists on paper (ForumThread.replies) and costs nothing to close off now.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ForumThread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    @Column(nullable = false)
    private String replyText;
}
