package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommunicationLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunicationChannel channel;

    private String recipient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType eventType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CommunicationStatus status = CommunicationStatus.PENDING;

    @Builder.Default
    private Integer attemptCount = 0;

    @Column(unique = true)
    private String idempotencyKey;

    private LocalDateTime lastAttemptAt;
}
