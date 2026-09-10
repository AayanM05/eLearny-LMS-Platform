package com.elearny.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "waitlist_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private LiveSessionSlot slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WaitlistStatus status = WaitlistStatus.WAITING;

    private LocalDateTime joinedAt;

    private LocalDateTime claimExpiresAt;
}
